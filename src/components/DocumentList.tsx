import { useEffect, useState } from 'react';
import { FileProcessor } from '@/services/FileProcessor/fileProcessor';

interface StorageFile {
  name: string;
  id: string;
  created_at?: string;
  updated_at?: string;
}

interface DocumentListProps {
  documents: Array<{ name: string; content: string }>;
}

export const DocumentList = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const fileList = await FileProcessor.listFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  if (isLoading) {
    return <div>Loading files...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Uploaded Files ({files.length})</h2>
      {files.length === 0 ? (
        <div className="text-gray-500">No files uploaded yet</div>
      ) : (
        files.map((file) => (
          <div key={file.name} className="py-2 px-4 hover:bg-gray-50 rounded flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{file.name}</span>
          </div>
        ))
      )}
    </div>
  );
};