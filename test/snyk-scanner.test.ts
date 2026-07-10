import { describe, expect, it } from 'vitest';
import { snykScanner } from '../src/scanners/snyk.js';

describe('snykScanner', () => {
  it('parses object reports', () => {
    const result = snykScanner.parse({
      vulnerabilities: [
        { packageName: 'pino', severity: 'high', title: 'Prototype pollution' },
        { packageName: 'zod', severity: 'medium' },
      ],
    });

    expect(result).toEqual({
      valid: true,
      findings: [
        { packageName: 'pino', severity: 'high', title: 'Prototype pollution' },
        { packageName: 'zod', severity: 'medium', title: undefined },
      ],
    });
  });

  it('parses array reports', () => {
    const result = snykScanner.parse([
      { vulnerabilities: [{ packageName: 'pino', severity: 'critical' }] },
      { vulnerabilities: [{ packageName: 'typescript', severity: 'low' }] },
    ]);

    expect(result).toEqual({
      valid: true,
      findings: [
        { packageName: 'pino', severity: 'critical', title: undefined },
        { packageName: 'typescript', severity: 'low', title: undefined },
      ],
    });
  });

  it('marks unexpected report shapes as invalid', () => {
    expect(snykScanner.parse({ error: 'Invalid token' })).toEqual({ valid: false, findings: [] });
  });
});
