import React, { useState, useEffect } from 'react';
import { VariableHighlighter } from '@/components/Common/VariableHighlighter';
import { VariableDetector } from '@/services/VariableProcessor/detector';
import { ClaudeAIClient } from '@/services/ClaudeAI/client';
import { Variable, VariableStatus } from '@/services/VariableProcessor/types';
import { DocumentList } from '@/components/DocumentList';
import { documentService, Document } from '@/services/Supabase/documentService';
import { FileUpload } from '@/components/Common/FileUpload';
import { FileProcessor } from '@/services/FileProcessor/fileProcessor';

interface StorageFile {
  name: string;
  created_at: string;
  id: string;
  last_accessed_at: string;
  metadata: any;
  updated_at: string;
}

export default function Home() {
  const [text, setText] = useState<string>(
    'Hello [name],\n\nYour account balance is [balance]. Your last transaction was on [last_transaction_date].\n\nBest regards,\nYour Accountant'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, content: string}>>([]);
  const [savedDocuments, setSavedDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders] = useState<string[]>([]);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [folderFiles, setFolderFiles] = useState<Record<string, StorageFile[]>>({});
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [filledText, setFilledText] = useState<string>(text);

  // Initialize Claude AI client with environment variable
  const claudeClient = new ClaudeAIClient(process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await documentService.getDocuments();
      setSavedDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const fileList = await FileProcessor.listFiles();
      console.log('Loaded files:', fileList); // Debug log
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

  const handleTextChange = (newText: string) => {
    setText(newText);
    const result = VariableDetector.detect(newText);
    setVariables(result.variables);
  };

  const handleFillVariables = async () => {
    try {
      setIsProcessing(true);
      
      if (!recipientEmail) {
        throw new Error('Recipient email is required');
      }

      const folderFiles = await FileProcessor.listFiles(recipientEmail);
      console.log('Found files for email:', folderFiles);  // Debug log
      
      // Filter out placeholder files
      const validFiles = folderFiles.filter(file => 
        !file.name.includes('.emptyFolderPlaceholder') && 
        file.name.toLowerCase().endsWith('.pdf')
      );
      console.log('Valid files after filtering:', validFiles);  // Debug log

      if (!validFiles.length) {
        throw new Error('No valid PDF files found for this recipient');
      }

      const filePath = `${recipientEmail}/${validFiles[0].name}`;
      console.log('Attempting to load file:', filePath);  // Debug log
      
      const pdfFile = await FileProcessor.getFile(filePath);
      if (!pdfFile || pdfFile.size === 0) {
        throw new Error('PDF file is empty or could not be loaded');
      }

      const response = await claudeClient.processPDF(pdfFile, variables);
      const extractedText = response.content[0].text;

      // Create a map of found variables
      const foundVariables: Record<string, string> = {};
      extractedText.split('\n').forEach((line: string) => {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map(s => s.trim());
          // Normalize the key to match our variable format
          const normalizedKey = key.replace(/[_\s]/g, '_').toUpperCase();
          foundVariables[normalizedKey] = value;
        }
      });

      console.log('Found variables:', foundVariables);

      // Update variable statuses and values
      setVariables(variables.map(variable => {
        const variableKey = variable.content.replace(/[\[\]]/g, '');
        return {
          ...variable,
          value: foundVariables[variableKey] || '',
          status: foundVariables[variableKey] ? VariableStatus.FILLED : VariableStatus.NOT_FOUND,
        };
      }));

    } catch (error) {
      console.error('Error filling variables:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      await documentService.saveDocument(text);
      await loadDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleSelectDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setText(doc.content);
    const result = VariableDetector.detect(doc.content);
    setVariables(result.variables);
  };

  const handleFileUpload = async (files: File[], targetFolder: string) => {
    setIsLoading(true);
    try {
      for (const file of files) {
        // Create the full path including the folder
        const filePath = targetFolder ? `${targetFolder}/${file.name}` : file.name;
        
        await FileProcessor.processFile(file, filePath);
      }
      await loadFolders();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const fileList = await FileProcessor.listFiles();
      const uniqueFolders = [...new Set(fileList.map(file => file.name.split('/')[0]))]
        .filter(folder => folder !== '.emptyFolderPlaceholder'); // Filter out placeholder
      setFolders(uniqueFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolder = async (folder: string) => {
    if (expandedFolder === folder) {
      setExpandedFolder(null);
      return;
    }

    try {
      const files = await FileProcessor.listFiles(folder);
      const filteredFiles = files.filter(file => !file.name.includes('.emptyFolderPlaceholder'));
      setFolderFiles(prev => ({ ...prev, [folder]: filteredFiles }));
      setExpandedFolder(folder);
    } catch (error) {
      console.error('Error loading folder contents:', error);
    }
  };

  const handleEmailChange = (email: string) => {
    setRecipientEmail(email);
    if (email && !folders.includes(email)) {
      setEmailError('No data available for this email address');
    } else {
      setEmailError('');
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">AI Email AutoFill App: for CPAs!</h1>
      {/* Email Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Enter email address..."
          className="w-full p-2 border rounded-md"
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      {/* Template Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Body:</label>
        <div className="mb-4">
          <VariableHighlighter 
            text={text} 
            onChange={handleTextChange}
            variables={variables}
            filledText={variables.reduce((acc, variable) => {
              return acc.replace(
                `[${variable.content}]`,
                variable.value || `[${variable.content}]`
              );
            }, text)}
          />
        </div>

        <div className="space-x-4 mb-8">
          <button
            onClick={handleFillVariables}
            disabled={isProcessing || variables.length === 0}
            className={`px-4 py-2 text-white bg-blue-600 rounded 
              ${(isProcessing || variables.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isProcessing ? 'Processing...' : 'Fill Variables'}
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileUpload 
            onUpload={handleFileUpload} 
            existingFolders={folders.filter(f => f.includes('@'))} 
          />
          <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX, TXT</p>
        </div>
      </div>

      {/* Folders and Files */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Folders in Database</h2>
        {folders.map((item) => {
          const isFolder = item.includes('@') || item === '.emptyFolderPlaceholder';
          return (
            <div key={item} className="mb-2">
              <div
                onClick={() => isFolder ? toggleFolder(item) : null}
                className={`py-2 px-4 hover:bg-gray-50 rounded flex items-center gap-2 ${isFolder ? 'cursor-pointer' : ''}`}
              >
                {isFolder ? (
                  <>
                    <svg 
                      className={`w-4 h-4 transition-transform ${expandedFolder === item ? 'transform rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                <span>{item}</span>
              </div>
              
              {isFolder && expandedFolder === item && folderFiles[item] && (
                <div className="ml-8">
                  {folderFiles[item].map((file) => (
                    <div key={file.id} className="py-2 px-4 hover:bg-gray-50 rounded flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>{file.name.split('/').pop()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
