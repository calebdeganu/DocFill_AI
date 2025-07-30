import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const PdfUploader = ({ setPdfFile, setFields }) => {
  const handleUpload = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('pdf', acceptedFiles[0]);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/pdf/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFields(response.data.fields);
      setPdfFile(URL.createObjectURL(acceptedFiles[0]));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg text-center">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the PDF here...</p>
      ) : (
        <p>Drag and drop a PDF, or click to select one</p>
      )}
    </div>
  );
};

export default PdfUploader;