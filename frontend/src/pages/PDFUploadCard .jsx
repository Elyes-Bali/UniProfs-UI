import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';

const PDFUploadCard = ({ summariesRemaining, onFileSelect }) => {
  const [fileName, setFileName] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName('Invalid file. Please drop a PDF.');
    }
  };

  return (
    <motion.div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Upload className="mr-2 text-indigo-500" /> Upload Document
      </h2>
      <motion.div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        whileHover={{ scale: 1.005, backgroundColor: "#eef2ff" }}
        className="flex-grow flex flex-col justify-center items-center border-2 border-dashed border-indigo-400 p-8 rounded-xl transition duration-200 cursor-pointer text-center bg-indigo-50/50"
      >
        <FileText className="text-indigo-600 mb-3" size={48} />
        <p className="text-lg font-semibold text-gray-700">Drag & Drop Your PDF Here</p>
        <p className="text-sm text-gray-500 mt-1">or click to browse (Max 10MB)</p>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="pdf-upload"
          onChange={(e) => e.target.files[0] && (setFileName(e.target.files[0].name), onFileSelect(e.target.files[0]))}
        />
        <label htmlFor="pdf-upload" className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
          Select PDF
        </label>
      </motion.div>

      {fileName && <p className="mt-4 text-sm text-center text-green-600 font-medium truncate">File ready: {fileName}</p>}
      <p className="mt-4 text-sm text-gray-500 text-center">
        <span className="font-semibold text-indigo-600">{summariesRemaining}</span> summaries remaining this month.
      </p>
    </motion.div>
  );
};

export default PDFUploadCard;
