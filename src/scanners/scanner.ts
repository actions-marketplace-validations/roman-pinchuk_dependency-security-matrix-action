import type { SecurityFinding } from '../types.js';

export type ScannerParseResult = {
  valid: boolean;
  findings: SecurityFinding[];
};

export type ScannerAdapter = {
  parse(report: unknown): ScannerParseResult;
};
