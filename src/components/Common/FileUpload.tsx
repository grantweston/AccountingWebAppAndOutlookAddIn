import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onUpload: (files: File[], targetFolder: string) => void;
  existingFolders: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, existingFolders }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetFolder, setTargetFolder] = useState('');
  const [isNewFolder, setIsNewFolder] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFiles(Array.from(event.target.files));
      setShowModal(true);
    }
  };

  const handleUpload = () => {
    if (targetFolder && selectedFiles.length) {
      onUpload(selectedFiles, targetFolder);
      setShowModal(false);
      setSelectedFiles([]);
      setTargetFolder('');
    }
  };

  return (
    <>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        Drag and drop files here, or click to select files
      </label>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Select Destination Folder</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isNewFolder}
                  onChange={() => setIsNewFolder(false)}
                  className="mr-2"
                />
                Existing Folder
              </label>
              {!isNewFolder && (
                <select
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value)}
                  className="mt-2 w-full p-2 border rounded"
                >
                  <option value="">Select a folder...</option>
                  {existingFolders.map(folder => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isNewFolder}
                  onChange={() => setIsNewFolder(true)}
                  className="mr-2"
                />
                New Folder
              </label>
              {isNewFolder && (
                <input
                  type="email"
                  placeholder="Enter email address for new folder"
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value)}
                  className="mt-2 w-full p-2 border rounded"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
                Upload
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};