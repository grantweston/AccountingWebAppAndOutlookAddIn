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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function callWithRetry(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error?.status === 529) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return callWithRetry(fn, retries - 1);
    }
    throw error;
  }
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

  private async retryWithBackoff(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        if (error?.status === 529 && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }

  private async rateLimitDelay() {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between requests
  }

  async processPDF(file: File, variables: any[]): Promise<any> {
    await this.rateLimitDelay();
    return this.retryWithBackoff(async () => {
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

      return callWithRetry(() =>
        this.client.beta.messages.create({
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
        })
      );
    });
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
