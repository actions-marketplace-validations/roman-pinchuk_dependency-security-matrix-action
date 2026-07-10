import type { SecurityFinding } from '../types.js';

export type ScannerAdapter = {
  parse(report: unknown): SecurityFinding[];
};
