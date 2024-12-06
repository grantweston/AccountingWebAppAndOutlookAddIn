import { GlobalWorkerOptions } from 'pdfjs-dist';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && !GlobalWorkerOptions.workerPort) {
  // Dynamic import of the worker
  import('pdfjs-dist/build/pdf.worker.entry').then((worker) => {
    GlobalWorkerOptions.workerPort = new worker.PDFWorker();
  });
}