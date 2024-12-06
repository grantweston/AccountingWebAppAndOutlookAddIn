import { v4 as uuidv4 } from 'uuid';
import { Variable, VariableStatus, DetectionResult } from './types';

export class VariableDetector {
  /**
   * Detects variables enclosed in square brackets and returns their positions
   */
  static detect(text: string): DetectionResult {
    const variables: Variable[] = [];
    let currentIndex = 0;
    
    while (true) {
      // Find opening bracket
      const startBracket = text.indexOf('[', currentIndex);
      if (startBracket === -1) break;
      
      // Find closing bracket
      const endBracket = text.indexOf(']', startBracket);
      if (endBracket === -1) break;
      
      // Extract variable content (without brackets)
      const content = text.slice(startBracket + 1, endBracket);
      
      // Only create variable if content isn't empty
      if (content.trim()) {
        variables.push({
          id: uuidv4(),
          content,
          startIndex: startBracket,
          endIndex: endBracket + 1,
          status: VariableStatus.DETECTED
        });
      }
      
      currentIndex = endBracket + 1;
    }
    
    return { text, variables };
  }

  /**
   * Updates the status of a specific variable
   */
  static updateVariableStatus(
    variables: Variable[],
    variableId: string,
    newStatus: VariableStatus
  ): Variable[] {
    return variables.map(variable => 
      variable.id === variableId 
        ? { ...variable, status: newStatus }
        : variable
    );
  }

  /**
   * Checks if a position in the text is within any variable
   */
  static isWithinVariable(position: number, variables: Variable[]): boolean {
    return variables.some(
      variable => position >= variable.startIndex && position < variable.endIndex
    );
  }
}
