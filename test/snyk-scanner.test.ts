import { describe, expect, it } from 'vitest';
import { snykScanner } from '../src/scanners/snyk.js';

describe('snykScanner', () => {
  it('parses object reports', () => {
    const findings = snykScanner.parse({
      vulnerabilities: [
        { packageName: 'pino', severity: 'high', title: 'Prototype pollution' },
        { packageName: 'zod', severity: 'medium' },
      ],
    });

    expect(findings).toEqual([
      { packageName: 'pino', severity: 'high', title: 'Prototype pollution' },
      { packageName: 'zod', severity: 'medium', title: undefined },
    ]);
  });

  it('parses array reports', () => {
    const findings = snykScanner.parse([
      { vulnerabilities: [{ packageName: 'pino', severity: 'critical' }] },
      { vulnerabilities: [{ packageName: 'typescript', severity: 'low' }] },
    ]);

    expect(findings).toEqual([
      { packageName: 'pino', severity: 'critical', title: undefined },
      { packageName: 'typescript', severity: 'low', title: undefined },
    ]);
  });
});
