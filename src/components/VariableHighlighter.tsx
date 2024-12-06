import React, { useState } from 'react';
import { ClaudeAIClient } from '../services/ClaudeAI/client';
import { Variable, VariableStatus } from '../services/VariableProcessor/types';
import { FileProcessor } from '../services/FileProcessor/fileProcessor';

export default function VariableHighlighter() {
  const [text, setText] = useState<string>('');
  const [filledText, setFilledText] = useState<string>('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [documents] = useState<string[]>([]);
  
  const handleFillVariables = async () => {
    try {
      const client = new ClaudeAIClient(process.env.NEXT_PUBLIC_CLAUDE_API_KEY || ''  );
      const folderFiles = await FileProcessor.listFiles();
      const pdfFile = await FileProcessor.getFile(folderFiles[0].name);
      
      const response = await client.processVariables(text, variables, pdfFile);
      
      setFilledText(response.filledText);
      console.log('Setting filled text:', response.filledText);
      
      setVariables(variables.map(variable => {
        const variableKey = variable.content.replace(/[\[\]]/g, '');
        return {
          ...variable,
          value: response.variables[variableKey]?.value || 'Not found',
          status: response.variables[variableKey] ? ('filled' as VariableStatus) : ('not-found' as VariableStatus)
        };
      }));
    } catch (error) {
      console.error('Error filling variables:', error);
    }
  };

  return (
    <div>
      {/* ... other UI elements ... */}
      <div className="preview">
        {filledText || text}  {/* This should show the filled text */}
      </div>
      {/* ... other UI elements ... */}
    </div>
  );
}