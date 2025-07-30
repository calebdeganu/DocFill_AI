import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Use CDN worker or import locally for Vite bundling
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs`;

function PdfViewer({ pdfFile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdfFile) return;

    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfFile);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error('Error rendering PDF:', error);
      }
    };

    renderPdf();

    // Cleanup blob URLs when component unmounts
    return () => {
      if (pdfFile.startsWith('blob:')) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);

  return (
    <div className="border rounded-lg bg-white p-2">
      {pdfFile ? (
        <canvas ref={canvasRef} className="w-full" />
      ) : (
        <p className="text-gray-600 text-center">No PDF uploaded</p>
      )}
    </div>
  );
}

export default PdfViewer;
