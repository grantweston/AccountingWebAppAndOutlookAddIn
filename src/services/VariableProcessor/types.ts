export interface Variable {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  status: VariableStatus;
  value?: string;
}

export enum VariableStatus {
  DETECTED = 'detected',   // Blue
  FILLED = 'filled',      // Green
  NOT_FOUND = 'notFound'  // Red
}

export interface DetectionResult {
  text: string;
  variables: Variable[];
}
