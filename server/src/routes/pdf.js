import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processPdf } from '../utils/pdfProcessor.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  },
});

// Upload PDF and extract fields
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.file.filename);
    const fields = await processPdf(filePath);
    res.json({ fields });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Save filled PDF (stub)
router.post('/save', async (req, res) => {
  try {
    const { pdf, fields } = req.body;
    // TODO: Apply field data to PDF
    const buffer = Buffer.isBuffer(pdf)
      ? pdf
      : Buffer.from(pdf.data || pdf); // handle array or base64
    res.set('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ error: 'Failed to save PDF' });
  }
});

export default router;
