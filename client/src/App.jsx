import { useState } from 'react';
import PdfUploader from './components/PdfUploader';
import PdfViewer from './components/PdfViewer';
import VoiceInput from './components/VoiceInput';
import FormReview from './components/FormReview';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [fields, setFields] = useState([]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">DocFill AI</h1>
      <PdfUploader setPdfFile={setPdfFile} setFields={setFields} />
      <PdfViewer pdfFile={pdfFile} />
      <VoiceInput setFields={setFields} />
      <FormReview fields={fields} setFields={setFields} pdfFile={pdfFile} />
    </div>
  );
}

export default App;