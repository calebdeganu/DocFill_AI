import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';

function FormReview({ fields, setFields, pdfFile }) {
  const handleChange = (index, value) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const handleSave = async () => {
    if (!pdfFile) {
      alert('No PDF available to save.');
      return;
    }

    const apiBase = import.meta.env.VITE_API_URL;
    if (!apiBase) {
      alert('API URL is not configured.');
      return;
    }

    try {
      // If pdfFile is a blob URL, pass as { url } or fetch original file from backend
      const pdf = await pdfjsLib.getDocument({ url: pdfFile }).promise;
      const pdfBytes = await pdf.getData();

      const response = await axios.post(
        `${apiBase}/api/pdf/save`,
        { pdf: pdfBytes, fields },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'filled_form.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to save PDF.');
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Form Fields</h2>
      {fields.length > 0 ? (
        <>
          {fields.map((field, index) => (
            <div key={index} className="mb-2">
              <label htmlFor={`field-${index}`} className="block text-gray-700">
                {field.label}
              </label>
              <input
                id={`field-${index}`}
                type="text"
                value={field.value || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save & Download PDF
          </button>
        </>
      ) : (
        <p className="text-gray-600">No fields detected.</p>
      )}
    </div>
  );
}

export default FormReview;
