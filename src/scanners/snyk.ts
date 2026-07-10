import type { SecurityFinding } from '../types.js';
import type { ScannerAdapter } from './scanner.js';

type SnykVulnerability = {
  packageName?: unknown;
  severity?: unknown;
  title?: unknown;
};

type SnykReport = {
  vulnerabilities?: unknown;
};

const severities = new Set(['low', 'medium', 'high', 'critical']);

export const snykScanner: ScannerAdapter = {
  parse(report: unknown): SecurityFinding[] {
    const reports = Array.isArray(report) ? report : [report];

    return reports.flatMap((entry) => {
      const vulnerabilities = (entry as SnykReport | undefined)?.vulnerabilities;
      if (!Array.isArray(vulnerabilities)) return [];

      return vulnerabilities.flatMap((vulnerability) => toSecurityFinding(vulnerability));
    });
  },
};

function toSecurityFinding(vulnerability: unknown): SecurityFinding[] {
  const snykVulnerability = vulnerability as SnykVulnerability;
  if (typeof snykVulnerability.packageName !== 'string') return [];

  return [
    {
      packageName: snykVulnerability.packageName,
      severity: toSeverity(snykVulnerability.severity),
      title: typeof snykVulnerability.title === 'string' ? snykVulnerability.title : undefined,
    },
  ];
}

function toSeverity(value: unknown): SecurityFinding['severity'] | undefined {
  if (typeof value !== 'string' || !severities.has(value)) return undefined;
  return value as SecurityFinding['severity'];
}
