import React, { useState } from 'react';
import { ClaudeAIClient } from '@/services/ClaudeAI/client';

export const OutlookToolbar = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleAskClaude = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      const client = new ClaudeAIClient(process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '');
      // Add Claude integration here
      setResponse('Claude response will go here');
    } catch (error) {
      console.error('Error asking Claude:', error);
      setResponse('Error communicating with Claude');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Ask about the document</h2>
      <div className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ask a question about the document..."
          rows={3}
        />
        <button
          onClick={handleAskClaude}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Asking Claude...' : 'Ask Claude'}
        </button>
        {response && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};
