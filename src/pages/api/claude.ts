import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ message: 'API key is missing' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: req.body.messages,
        temperature: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const claudeResponse = await response.json();
    console.log('Claude raw response:', claudeResponse);

    // Extract the content from Claude's response
    const content = claudeResponse.content[0].text;
    
    // Parse the JSON from the content
    try {
      const parsedContent = JSON.parse(content);
      console.log('Parsed content:', parsedContent);
      return res.status(200).json(parsedContent);
    } catch (e) {
      console.error('Failed to parse Claude response:', e);
      return res.status(500).json({ 
        error: 'Failed to parse response',
        rawContent: content
      });
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ message: String(error) });
  }
}