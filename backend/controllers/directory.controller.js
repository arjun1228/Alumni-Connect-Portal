import { dataStore } from '../services/dataStore.js';
import { serializePayload } from '../utils/roleMapper.js';

export const getDirectory = async (req, res, next) => {
    try {
        const { role, search } = req.query;
        const query = {};

        // Only show students and alumni in public directories (omit admins)
        if (role && typeof role === 'string') {
            query.role = role.toLowerCase();
        } else {
            query.role = { $ne: 'admin' };
        }

        // Support string matching against core fields
        if (search && typeof search === 'string') {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { currentCompany: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await dataStore.find('User', query);

        // Exclude password hashes
        const cleanedUsers = users.map(u => {
            const { passwordHash, ...clean } = u;
            return clean;
        });
        
        const mappedUsers = serializePayload(cleanedUsers);

        res.status(200).json({
            success: true,
            data: mappedUsers
        });
    } catch (err) {
        next(err);
    }
};

export const getProfileById = async (req, res, next) => {
    try {
        const user = await dataStore.findById('User', req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found.'
            });
        }

        const { passwordHash, ...cleanUser } = user;
        const mappedUser = serializePayload(cleanUser);

        res.status(200).json({
            success: true,
            data: mappedUser
        });
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Strict permit allow-list for profile fields to prevent privilege escalation (e.g. role, password change)
        const allowedFields = [
            'name', 'profilePicture', 'avatar', 'location', 
            'department', 'course', 'yearOfStudy', 'interests', 'learningInterests', 
            'skills', 'resumeLink', 'resumeName', 'projects', 'projectShowcase', 
            'bio', 'professionalBio', 'experience', 'yearsOfExperience', 'willingToMentor',
            'company', 'currentCompany', 'title', 'jobTitle'
        ];

        const sanitizedUpdates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                sanitizedUpdates[key] = req.body[key];
            }
        }

        // Handle bidirectional mappings / synchronizations for database & frontend consistency
        if (sanitizedUpdates.company !== undefined) {
            sanitizedUpdates.currentCompany = sanitizedUpdates.company;
        } else if (sanitizedUpdates.currentCompany !== undefined) {
            sanitizedUpdates.company = sanitizedUpdates.currentCompany;
        }

        if (sanitizedUpdates.title !== undefined) {
            sanitizedUpdates.jobTitle = sanitizedUpdates.title;
        } else if (sanitizedUpdates.jobTitle !== undefined) {
            sanitizedUpdates.title = sanitizedUpdates.jobTitle;
        }

        if (sanitizedUpdates.projects !== undefined) {
            sanitizedUpdates.projectShowcase = sanitizedUpdates.projects;
        } else if (sanitizedUpdates.projectShowcase !== undefined) {
            sanitizedUpdates.projects = sanitizedUpdates.projectShowcase;
        }

        if (sanitizedUpdates.bio !== undefined) {
            sanitizedUpdates.professionalBio = sanitizedUpdates.bio;
        } else if (sanitizedUpdates.professionalBio !== undefined) {
            sanitizedUpdates.bio = sanitizedUpdates.professionalBio;
        }

        if (sanitizedUpdates.experience !== undefined) {
            sanitizedUpdates.yearsOfExperience = sanitizedUpdates.experience;
        } else if (sanitizedUpdates.yearsOfExperience !== undefined) {
            sanitizedUpdates.experience = sanitizedUpdates.yearsOfExperience;
        }

        if (sanitizedUpdates.interests !== undefined) {
            sanitizedUpdates.learningInterests = sanitizedUpdates.interests;
        } else if (sanitizedUpdates.learningInterests !== undefined) {
            sanitizedUpdates.interests = sanitizedUpdates.learningInterests;
        }

        if (sanitizedUpdates.avatar !== undefined) {
            sanitizedUpdates.profilePicture = sanitizedUpdates.avatar;
        } else if (sanitizedUpdates.profilePicture !== undefined) {
            sanitizedUpdates.avatar = sanitizedUpdates.profilePicture;
        }

        const updated = await dataStore.update('User', { _id: userId }, { $set: sanitizedUpdates });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const { passwordHash, ...cleanUser } = updated;
        const mappedUser = serializePayload(cleanUser);
        res.status(200).json({
            success: true,
            data: mappedUser
        });
    } catch (err) {
        next(err);
    }
};

export const selectGoogleUserRole = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const currentUserId = (req.user.id || req.user._id).toString();
        if (currentUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You cannot select role for another user.'
            });
        }
        
        const user = await dataStore.findById('User', userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        
        if (!user.needsRoleSelection) {
            return res.status(400).json({
                success: false,
                message: 'Role has already been selected.'
            });
        }
        
        const { role, department, yearOfStudy, currentCompany, jobTitle } = req.body;
        if (!['student', 'alumni'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role selection. Must be student or alumni.'
            });
        }
        
        const updates = {
            role,
            needsRoleSelection: false
        };
        
        if (role === 'student') {
            updates.department = department || '';
            updates.yearOfStudy = yearOfStudy ? parseInt(yearOfStudy) : null;
            updates.approvalStatus = 'approved';
            updates.isVerified = true;
        } else if (role === 'alumni') {
            updates.currentCompany = currentCompany || '';
            updates.jobTitle = jobTitle || 'Alumni Member';
            updates.approvalStatus = 'pending';
            updates.isVerified = true;
        }
        
        const updated = await dataStore.update('User', { _id: userId }, { $set: updates });
        
        const { passwordHash: _, ...cleanUser } = updated;
        const mappedUser = serializePayload(cleanUser);
        
        res.status(200).json({
            success: true,
            message: 'Role selected successfully.',
            data: mappedUser
        });
    } catch (err) {
        next(err);
    }
};
