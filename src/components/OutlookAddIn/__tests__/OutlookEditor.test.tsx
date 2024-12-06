import { render } from '@testing-library/react';
import { OutlookEditor } from '../OutlookEditor';
import { VariableDetector } from '@/services/VariableProcessor/detector';

// Mock Office.js
const mockOffice = {
  context: {
    mailbox: {
      item: {
        body: {
          getAsync: jest.fn(),
          setAsync: jest.fn()
        }
      }
    }
  },
  AsyncResultStatus: {
    Succeeded: 'succeeded',
    Failed: 'failed'
  },
  CoercionType: {
    Text: 'text',
    Html: 'html'
  }
};

(global as any).Office = mockOffice;

jest.mock('@/services/VariableProcessor/detector');

describe('OutlookEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Office.js mocks
    (Office.context.mailbox.item.body.getAsync as jest.Mock).mockImplementation(
      (coercionType, callback) => {
        callback({ status: Office.AsyncResultStatus.Succeeded, value: 'Test [variable]' });
      }
    );
    (Office.context.mailbox.item.body.setAsync as jest.Mock).mockImplementation(
      (text, options, callback) => {
        if (callback) callback({ status: Office.AsyncResultStatus.Succeeded });
      }
    );
  });

  test('initializes and starts monitoring email content', () => {
    render(<OutlookEditor />);
    expect(Office.context.mailbox.item.body.getAsync).toHaveBeenCalled();
  });

  test('detects and highlights new variables', async () => {
    (VariableDetector.detect as jest.Mock).mockReturnValue({
      text: 'Test [variable]',
      variables: [{
        id: '1',
        content: 'variable',
        startIndex: 5,
        endIndex: 15,
        status: 'detected'
      }]
    });

    render(<OutlookEditor />);

    // Wait for initial check
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(Office.context.mailbox.item.body.setAsync).toHaveBeenCalledWith(
      expect.stringContaining('background-color'),
      expect.any(Object)
    );
  });

  test('handles errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (Office.context.mailbox.item.body.getAsync as jest.Mock).mockImplementation(
      (coercionType, callback) => {
        callback({ status: Office.AsyncResultStatus.Failed, error: { message: 'Test error' } });
      }
    );

    render(<OutlookEditor />);

    // Wait for error handling
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
