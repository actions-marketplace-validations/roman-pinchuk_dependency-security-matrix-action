import { describe, expect, it } from 'vitest';
import { generateMatrix } from '../src/markdown/matrix.js';
import { replaceMarkedSection } from '../src/markdown/replace.js';

const dependencies = [
  { name: '@playwright/test', requestedVersion: '1.61.1', scope: 'development' as const },
  { name: 'pino', requestedVersion: '^10.0.0', scope: 'production' as const },
];

describe('generateMatrix', () => {
  it('generates security table when findings are available', () => {
    const result = generateMatrix({
      dependencies,
      findings: [
        { packageName: 'pino', severity: 'high' },
        { packageName: 'pino', severity: 'medium' },
      ],
      latestVersions: [
        { packageName: '@playwright/test', version: '1.61.1' },
        { packageName: 'pino', version: '10.1.0' },
      ],
      heading: '## Matrix',
      includeLatestVersion: true,
      includeStatusNote: true,
      securityStatusAvailable: true,
    });

    expect(result.markdown).toContain('| Dependency | Type | Current Version | Security Status | Latest npm Version |');
    expect(result.markdown).toContain('| **pino** | dependencies | `^10.0.0` | 1 high, 1 medium | `10.1.0` |');
    expect(result.issueCount).toBe(2);
    expect(result.securityStatusAvailable).toBe(true);
  });

  it('generates fallback table without security status', () => {
    const result = generateMatrix({
      dependencies,
      findings: [],
      latestVersions: [{ packageName: 'pino', version: '10.1.0' }],
      heading: '## Matrix',
      includeLatestVersion: true,
      includeStatusNote: true,
      securityStatusAvailable: false,
    });

    expect(result.markdown).toContain('| Dependency | Type | Current Version | Latest npm Version |');
    expect(result.markdown).not.toContain('Security Status');
    expect(result.markdown).toContain('> Security status unavailable because no scanner report was provided or parsed.');
  });
});

describe('replaceMarkedSection', () => {
  it('replaces content between markers', () => {
    const readme = ['# Title', '<!-- START_MATRIX_TABLE -->', 'old', '<!-- END_MATRIX_TABLE -->', 'tail'].join('\n');

    expect(
      replaceMarkedSection(readme, '\nnew\n', {
        startMarker: '<!-- START_MATRIX_TABLE -->',
        endMarker: '<!-- END_MATRIX_TABLE -->',
        failOnMissingMarkers: true,
      }),
    ).toBe(['# Title', '<!-- START_MATRIX_TABLE -->', 'new', '<!-- END_MATRIX_TABLE -->', 'tail'].join('\n'));
  });

  it('can append markers when missing', () => {
    const result = replaceMarkedSection('# Title\n', '\nnew\n', {
      startMarker: '<!-- START_MATRIX_TABLE -->',
      endMarker: '<!-- END_MATRIX_TABLE -->',
      failOnMissingMarkers: false,
    });

    expect(result).toContain('<!-- START_MATRIX_TABLE -->\nnew\n<!-- END_MATRIX_TABLE -->');
  });
});
