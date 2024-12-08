import { useState } from 'react';
import { ClaudeAIClient } from '@/services/ClaudeAI/client';
import { Variable, VariableStatus } from '@/services/VariableProcessor/types';
import { VariableDetector } from '@/services/VariableProcessor/detector';
import { FileProcessor } from '@/services/FileProcessor/fileProcessor';
import { isOfficeReady } from '@/utils/environment';

export const useEmailProcessor = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processEmail = async (emailContent: string) => {
    setIsProcessing(true);
    try {
      if (!isOfficeReady()) {
        throw new Error('Office.js not initialized');
      }

      // Get recipient's email from Outlook
      const item = Office.context.mailbox.item;
      if (!item) {
        throw new Error('No active email item found');
      }
      const recipients = item?.to || [];
      const recipientEmail = recipients[0]?.emailAddress;

      if (!recipientEmail) {
        throw new Error('No recipient email found');
      }

      // Detect variables in the email content
      const result = VariableDetector.detect(emailContent);
      setVariables(result.variables);

      // Get files for this recipient
      const folderFiles = await FileProcessor.listFiles(recipientEmail);
      const validFiles = folderFiles.filter(file => 
        !file.name.includes('.emptyFolderPlaceholder') && 
        file.name.toLowerCase().endsWith('.pdf')
      );

      if (!validFiles.length) {
        throw new Error('No valid PDF files found for this recipient');
      }

      // Get the first PDF file
      const filePath = `${recipientEmail}/${validFiles[0].name}`;
      const pdfFile = await FileProcessor.getFile(filePath);
      
      if (!pdfFile || pdfFile.size === 0) {
        throw new Error('PDF file is empty or could not be loaded');
      }

      // Process with Claude
      const claudeClient = new ClaudeAIClient(process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '');
      const response = await claudeClient.processPDF(pdfFile, variables);
      
      // Process response and update variables
      const extractedText = response.content;

      return extractedText;
    } catch (error) {
      console.error('Error processing email:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processEmail,
    variables,
    isProcessing
  };
}; 