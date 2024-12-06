import { ClaudeAIClient } from '../client';
import { Variable, VariableStatus } from '../../VariableProcessor/types';

describe('ClaudeAIClient', () => {
  let client: ClaudeAIClient;

  beforeEach(() => {
    client = new ClaudeAIClient('test-api-key');
  });

  test('processes variables correctly', async () => {
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        content: [{
          text: `{
            "variables": {
              "name": {
                "value": "John Doe",
                "source": {
                  "document": "client_info.pdf",
                  "page": 1
                }
              }
            }
          }`
        }]
      })
    });

    const variables: Variable[] = [{
      id: '1',
      content: 'name',
      startIndex: 0,
      endIndex: 6,
      status: VariableStatus.DETECTED
    }];

    const result = await client.processVariables(
      'Hello [name]',
      variables,
      ['Sample document content']
    );

    expect(result.variables.name.value).toBe('John Doe');
    expect(result.variables.name.source!.document).toBe('client_info.pdf');
  });
});