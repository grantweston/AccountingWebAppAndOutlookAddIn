import React, { useEffect, useState } from 'react';
import { VariableDetector } from '../../services/VariableProcessor/detector';
import { Variable, VariableStatus } from '../../services/VariableProcessor/types';
import { Document as SupabaseDocument } from '@/services/Supabase/documentService';

interface VariableHighlighterProps {
  text: string;
  onChange: (text: string) => void;
  variables?: Variable[];
  documents?: SupabaseDocument[];
}

const getHighlightColor = (status: VariableStatus): string => {
  switch (status) {
    case VariableStatus.DETECTED:
      return '#ADD8E6'; // Light blue
    case VariableStatus.FILLED:
      return '#90EE90'; // Light green
    case VariableStatus.NOT_FOUND:
      return '#FFB6C1'; // Light red
    default:
      return 'transparent';
  }
};

export const VariableHighlighter: React.FC<VariableHighlighterProps> = ({
  text,
  onChange,
  variables: externalVariables,
}) => {
  const [internalVariables, setInternalVariables] = useState<Variable[]>([]);
  const variables = externalVariables || internalVariables;

  useEffect(() => {
    if (!externalVariables) {
      const result = VariableDetector.detect(text);
      setInternalVariables(result.variables);
    }
  }, [text, externalVariables]);

  const renderHighlightedText = () => {
    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    variables.forEach((variable, index) => {
      // Add text before the variable
      if (variable.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, variable.startIndex)}
          </span>
        );
      }

      // Add the highlighted variable - show value if filled, otherwise show original
      elements.push(
        <span
          key={variable.id}
          style={{
            backgroundColor: getHighlightColor(variable.status),
            padding: '0 1px',
            borderRadius: '2px',
          }}
        >
          {variable.status === VariableStatus.FILLED 
            ? variable.value 
            : text.slice(variable.startIndex, variable.endIndex)}
        </span>
      );

      lastIndex = variable.endIndex;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-end">{text.slice(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="variable-highlighter">
      <div 
        className="editor-container border border-gray-300 rounded-lg"
        style={{ position: 'relative' }}
      >
        <div
          className="highlighted-content"
          style={{
            position: 'relative',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            padding: '8px',
            minHeight: '100px',
          }}
        >
          {renderHighlightedText()}
        </div>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            color: 'transparent',
            caretColor: 'black',
            backgroundColor: 'transparent',
            resize: 'none',
            border: 'none',
            padding: '8px',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            overflow: 'hidden',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
};