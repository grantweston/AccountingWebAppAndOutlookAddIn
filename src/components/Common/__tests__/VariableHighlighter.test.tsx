import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { VariableHighlighter } from '../VariableHighlighter';

describe('VariableHighlighter', () => {
  test('highlights variables correctly', () => {
    const handleChange = jest.fn();
    render(
      <VariableHighlighter
        text="Hello [name], your balance is [balance]."
        onChange={handleChange}
        variables={[]}
      />
    );

    // Check if variables are highlighted
    const highlightedElements = screen.getAllByText(/(\[name\]|\[balance\])/i).filter(
      element => element.tagName.toLowerCase() === 'span'
    );
    expect(highlightedElements).toHaveLength(2);
  });

  test('calls onChange when text is modified', () => {
    const handleChange = jest.fn();
    render(
      <VariableHighlighter
        text="Hello [name]"
        onChange={handleChange}
        variables={[]}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello [newname]' } });
    
    expect(handleChange).toHaveBeenCalledWith('Hello [newname]');
  });
});