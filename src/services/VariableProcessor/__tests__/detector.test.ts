import { VariableDetector } from '../detector';
import { VariableStatus } from '../types';

describe('VariableDetector', () => {
  test('detects variables in text', () => {
    const text = 'Hello [name], your balance is [balance].';
    const result = VariableDetector.detect(text);
    
    expect(result.variables).toHaveLength(2);
    expect(result.variables[0].content).toBe('name');
    expect(result.variables[1].content).toBe('balance');
    expect(result.variables[0].status).toBe(VariableStatus.DETECTED);
  });

  test('updates variable status', () => {
    const text = 'Hello [name]';
    const { variables } = VariableDetector.detect(text);
    const updatedVariables = VariableDetector.updateVariableStatus(
      variables,
      variables[0].id,
      VariableStatus.FILLED
    );
    
    expect(updatedVariables[0].status).toBe(VariableStatus.FILLED);
  });

  test('checks if position is within variable', () => {
    const text = 'Hello [name]';
    const { variables } = VariableDetector.detect(text);
    
    expect(VariableDetector.isWithinVariable(7, variables)).toBe(true);  // Inside [name]
    expect(VariableDetector.isWithinVariable(0, variables)).toBe(false); // At 'H'
  });
});