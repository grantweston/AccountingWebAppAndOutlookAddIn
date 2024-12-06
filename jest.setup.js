import '@testing-library/jest-dom';

global.Office = {
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