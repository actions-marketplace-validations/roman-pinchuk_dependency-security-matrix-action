import { snykScanner } from './snyk.js';
import type { ScannerAdapter } from './scanner.js';

export function getScannerAdapter(scanner: string): ScannerAdapter {
  if (scanner === 'snyk') return snykScanner;

  throw new Error(`Unsupported scanner: ${scanner}. Supported scanners: snyk.`);
}
