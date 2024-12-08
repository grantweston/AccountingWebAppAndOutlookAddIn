import { useState } from 'react';
import { useOutlookEmail } from '@/hooks/useOutlookEmail';
import { useEmailProcessor } from '@/hooks/useEmailProcessor';

export function OutlookToolbar() {
  const { emailContent, updateEmail } = useOutlookEmail();
  const { processEmail, isProcessing } = useEmailProcessor();
  const [message, setMessage] = useState(emailContent);

  const handleProcessWithAI = async () => {
    try {
      const result = await processEmail(message);
      await updateEmail(result);
    } catch (error) {
      console.error('Failed to process email:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Email Assistant</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
      </div>
      
      <div className="flex space-x-4">
        <button 
          onClick={handleProcessWithAI}
          disabled={isProcessing}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Process with AI'}
        </button>
      </div>
    </div>
  );
}
