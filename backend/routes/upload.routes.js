import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authenticate.js';
import { uploadMedia } from '../services/mediaUpload.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed'));
        }
    }
});

const router = express.Router();

router.post('/', authenticate, (req, res, next) => {
    upload.any()(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error'
            });
        }

        try {
            const files = req.files || (req.file ? [req.file] : []);
            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded.'
                });
            }

            if (files.length > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum 5 files allowed per upload.'
                });
            }

            const uploadPromises = files.map(file => uploadMedia(file.buffer, file.originalname));
            const results = await Promise.all(uploadPromises);
            const urls = results.map(r => r.url);

            return res.status(200).json({
                success: true,
                url: urls[0],
                urls,
                data: { url: urls[0], urls }
            });
        } catch (uploadErr) {
            next(uploadErr);
        }
    });
});

export default router;
