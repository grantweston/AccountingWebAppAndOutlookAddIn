import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeAIResponse {
  variables: {
    [key: string]: {
      value: string;
      source?: {
        document: string;
        page: number;
      };
    };
  };
  filledText: string;
}

export class ClaudeAIClient {
  private client: Anthropic;
  private model = 'claude-3-5-sonnet-20241022';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async processPDF(file: File, variables: any[]): Promise<any> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
    
    const prompt = `Extract only the following variables from this tax return. 
    For each variable, return ONLY the value, with no additional text or context.
    If a value is not found, return exactly "NOT_FOUND".
    Format each line as VARIABLE_NAME: value

    Example format:
    CLIENT_NAME: John Smith
    TAX_AMOUNT: $5,000
    MISSING_VALUE: NOT_FOUND

    Variables to find: ${variables.map(v => v.content.replace(/[\[\]]/g, '')).join(', ')}`;

    console.log('Prompt to Claude:', prompt);

    const response = await this.client.beta.messages.create({
      model: this.model,
      betas: ["pdfs-2024-09-25"],
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              media_type: 'application/pdf',
              type: 'base64',
              data: pdfBase64,
            },
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    });

    console.log('Claude response:', JSON.stringify(response, null, 2));
    return response;
  }

  async processVariables(text: string, variables: any[], file: File): Promise<any> {
    console.log('Sending to Claude:', {
      text,
      variables,
      fileSize: file.size
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);
    formData.append('variables', JSON.stringify(variables));
    
    const response = await fetch('/api/claude', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    return response.json();
  }
}
