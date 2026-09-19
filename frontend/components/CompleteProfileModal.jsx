import React from 'react';
import { UserRole } from '../types';
import { UserCircle, AlertCircle, ArrowRight, X, CheckCircle2 } from 'lucide-react';

export const isProfileComplete = (user) => {
  if (!user || user.role === 'admin' || user.role === UserRole.ADMIN) {
    return true; // Admins exempt
  }

  const isStudent = user.role === UserRole.UNDERGRADUATE || user.role === 'student' || user.role === UserRole.STUDENT;

  if (isStudent) {
    const hasDept = Boolean(user.department || user.course);
    const hasYear = Boolean(user.yearOfStudy || user.graduationYear);
    const hasSkillsOrInterests = (Array.isArray(user.skills) && user.skills.length > 0) || (Array.isArray(user.interests) && user.interests.length > 0);
    return hasDept && hasYear && hasSkillsOrInterests;
  } else {
    // Alumni
    const hasCompany = Boolean(user.company || user.currentCompany);
    const hasTitle = Boolean(user.title || user.jobTitle);
    const hasExperience = Boolean(user.experience || user.yearsOfExperience);
    return hasCompany && hasTitle && hasExperience;
  }
};

export const getMissingProfileFields = (user) => {
  if (!user || user.role === 'admin' || user.role === UserRole.ADMIN) {
    return [];
  }

  const isStudent = user.role === UserRole.UNDERGRADUATE || user.role === 'student' || user.role === UserRole.STUDENT;
  const missing = [];

  if (isStudent) {
    if (!user.department && !user.course) missing.push({ label: 'Department / Major', icon: 'Academic Department' });
    if (!user.yearOfStudy && !user.graduationYear) missing.push({ label: 'Year of Study / Graduation', icon: 'Year of Study' });
    if ((!user.skills || user.skills.length === 0) && (!user.interests || user.interests.length === 0)) {
      missing.push({ label: 'Skills & Learning Interests', icon: 'Skills' });
    }
  } else {
    if (!user.company && !user.currentCompany) missing.push({ label: 'Company / Organization', icon: 'Current Company' });
    if (!user.title && !user.jobTitle) missing.push({ label: 'Job Title / Designation', icon: 'Job Title' });
    if (!user.experience && !user.yearsOfExperience) missing.push({ label: 'Years of Professional Experience', icon: 'Experience' });
  }

  return missing;
};

export const CompleteProfileModal = ({ user, onCompleteNow, onDismiss }) => {
  if (!user || isProfileComplete(user)) return null;

  const isStudent = user.role === UserRole.UNDERGRADUATE || user.role === 'student' || user.role === UserRole.STUDENT;
  const missingFields = getMissingProfileFields(user);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-2xl text-white ${isStudent ? 'bg-indigo-600 shadow-lg shadow-indigo-200/50 dark:shadow-none' : 'bg-emerald-600 shadow-lg shadow-emerald-200/50 dark:shadow-none'}`}>
            <UserCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complete Your Profile</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isStudent ? 'Help alumni mentors get to know you' : 'Increase credibility for mentorship & postings'}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Welcome to AlumniConnect! Your account is active, but your profile is currently missing key details required for peer and mentor directory listings.
        </p>

        {missingFields.length > 0 && (
          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              Required Fields Missing:
            </h4>
            <ul className="space-y-1.5">
              {missingFields.map((field, idx) => (
                <li key={idx} className="text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{field.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={onCompleteNow}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              isStudent 
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/50 dark:shadow-none' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50 dark:shadow-none'
            }`}
          >
            Complete Profile Now
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};
