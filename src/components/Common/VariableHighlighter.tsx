import React, { useEffect } from 'react';
import { Variable, VariableStatus } from '../../services/VariableProcessor/types';

interface VariableHighlighterProps {
  text: string;
  onChange: (text: string) => void;
  variables: Variable[];
  filledText?: string;
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
  variables,
  filledText,
}) => {
  useEffect(() => {
    const handleCopy = (e: Event) => {
      if (!(e instanceof ClipboardEvent)) return;
      e.preventDefault();
      const textToCopy = filledText || variables.reduce((acc, variable) => {
        return acc.replace(
          `[${variable.content}]`,
          variable.value || `[${variable.content}]`
        );
      }, text);
      e.clipboardData?.setData('text/plain', textToCopy);
    };

    const element = document.querySelector('.variable-highlighter');
    element?.addEventListener('copy', handleCopy as EventListener);
    return () => element?.removeEventListener('copy', handleCopy as EventListener);
  }, [text, variables, filledText]);

  const renderHighlightedText = () => {
    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    // Sort variables by their start index to process them in order
    const sortedVariables = [...variables].sort((a, b) => a.startIndex - b.startIndex);

    sortedVariables.forEach((variable, index) => {
      // Add text before the variable
      if (variable.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, variable.startIndex)}
          </span>
        );
      }

      // Add the highlighted variable - show value if filled, otherwise show placeholder
      elements.push(
        <span
          key={`var-${index}`}
          style={{
            backgroundColor: getHighlightColor(variable.status),
            padding: '0 1px',
            borderRadius: '2px',
          }}
        >
          {variable.value || text.slice(variable.startIndex, variable.endIndex)}
        </span>
      );

      lastIndex = variable.endIndex;
    });

    // Add any remaining text after the last variable
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
          data-filled-text={filledText || text}
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
          onCopy={(e) => {
            if (filledText) {
              e.preventDefault();
              e.clipboardData.setData('text/plain', filledText);
            }
          }}
        />
      </div>
    </div>
  );
};