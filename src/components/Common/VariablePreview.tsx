import React from 'react';
import { Variable } from '../../services/VariableProcessor/types';

interface VariablePreviewProps {
  variable: Variable;
  documents: Array<{ name: string; content: string }>;
  position: { x: number; y: number };
}

export const VariablePreview: React.FC<VariablePreviewProps> = ({
  variable,
  documents,
  position
}) => {
  const variableName = variable.content.replace(/[\[\]]/g, '');
  const relevantContent = documents.map(doc => {
    const lines = doc.content.split('\n')
      .filter(line => line.toLowerCase().includes(variableName.toLowerCase()))
      .join('\n');
    return lines ? { name: doc.name, content: lines } : null;
  }).filter(Boolean);

  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '400px',
        maxHeight: '300px',
        overflow: 'auto'
      }}
    >
      <h3 className="font-medium mb-2">Relevant Content for [{variableName}]</h3>
      {relevantContent.length > 0 ? (
        relevantContent.map((doc, index) => (
          <div key={index} className="mb-3">
            <div className="text-sm font-medium text-gray-600">{doc!.name}</div>
            <pre className="text-sm bg-gray-50 p-2 rounded mt-1 whitespace-pre-wrap">
              {doc!.content}
            </pre>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No relevant content found in uploaded documents</p>
      )}
    </div>
  );
};