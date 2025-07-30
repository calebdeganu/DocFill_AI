import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow the frontend origin
app.use(cors({
  origin: 'https://cuddly-parakeet-pjqr99jrjq5v2v57-5173.app.github.dev',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});