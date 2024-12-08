import { useState } from 'react';

export function OutlookToolbar() {
  const [message, setMessage] = useState('');

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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Process with AI
        </button>
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Add Signature
        </button>
      </div>
    </div>
  );
}
