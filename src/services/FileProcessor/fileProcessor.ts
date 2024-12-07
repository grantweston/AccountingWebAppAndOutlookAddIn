import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../Supabase/client';

// Set the worker source
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: any;
}

export class FileProcessor {
  static async testSupabaseConnection() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Supabase connection test error:', error);
        return false;
      }
      console.log('Supabase connection successful:', data);
      return true;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  static async processFile(file: File, targetFolder: string): Promise<{ name: string; content: string; path?: string }> {
    const fileName = `${targetFolder}/${file.name}`;
    const fileType = file.type;
    
    try {
      let content = '';
      switch (fileType) {
        case 'application/pdf':
          content = await this.processPDF(file);
          break;
        case 'text/plain':
          content = await file.text();
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      console.log('Attempting storage upload...', {
        bucket: 'documents',
        fileName,
        fileSize: file.size
      });

      // Upload raw file to Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', {
          message: error.message,
          name: error.name,
          details: error
        });
        throw error;
      }

      console.log('Upload successful:', data);

      return { 
        name: fileName, 
        content,
        path: data?.path 
      };
    } catch (error: any) {
      console.error('Full error details:', {
        error,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  static async processPDF(file: File): Promise<string> {
    // Example using pdf-lib or pdfjs-dist
    const pdfText = '...'; // Extract text from PDF
    console.log('Extracted PDF content:', pdfText.substring(0, 100) + '...');
    return pdfText;
  }

  static async listFiles(folder?: string): Promise<StorageFile[]> {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .list(folder || '', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  static async getFileContent(emailFolder: string, path: string): Promise<{ content: string }> {
    try {
      // Strip any leading slashes or 'documents/' prefix
      const cleanEmail = emailFolder.replace(/^\/+|\/+$/g, '');
      const fileName = path.replace(/^.*[\\\/]/, '');
      const cleanPath = `${cleanEmail}/${fileName}`;

      console.log('File access attempt:', {
        originalPath: path,
        cleanEmail,
        fileName,
        finalPath: cleanPath
      });

      const { data, error } = await supabase.storage
        .from('documents')
        .download(cleanPath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from storage');
      }

      const blob = new Blob([data], { type: 'application/pdf' });
      const file = new File([blob], cleanPath.split('/').pop() || '', { type: 'application/pdf' });
      const content = await this.processPDF(file);
      
      return { content };
    } catch (error: any) {
      console.error('Exception caught:', {
        error,
        message: error.message,
        path: path
      });
      throw error;
    }
  }

  static async getFile(filePath: string): Promise<File> {
    try {
      console.log('Original file path:', filePath);
      
      // Clean the path - just use the email folder and filename
      const cleanPath = filePath
        .split('/')
        .slice(-2)  // Take only the last two parts (email and filename)
        .join('/');

      console.log('Cleaned path for Supabase:', cleanPath);

      const { data, error } = await supabase.storage
        .from('documents')
        .download(cleanPath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from storage');
      }

      return new File([data], cleanPath.split('/').pop() || 'document', {
        type: data.type || 'application/octet-stream'
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}