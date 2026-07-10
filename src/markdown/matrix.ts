import type { Dependency, LatestVersion, MatrixResult, SecurityFinding } from '../types.js';

type MatrixOptions = {
  dependencies: Dependency[];
  findings: SecurityFinding[];
  latestVersions: LatestVersion[];
  heading: string;
  includeLatestVersion: boolean;
  includeStatusNote: boolean;
  securityStatusAvailable: boolean;
};

const severityOrder: Array<NonNullable<SecurityFinding['severity']>> = [
  'critical',
  'high',
  'medium',
  'low',
];

export function generateMatrix(options: MatrixOptions): MatrixResult {
  const findingsByPackage = groupFindings(options.findings);
  const latestByPackage = new Map(
    options.latestVersions.map((latestVersion) => [latestVersion.packageName, latestVersion.version]),
  );
  const headers = ['Dependency', 'Type', 'Current Version'];

  if (options.securityStatusAvailable) headers.push('Security Status');
  if (options.includeLatestVersion) headers.push('Latest npm Version');

  const lines = ['', options.heading, '', renderHeader(headers), renderAlignment(headers.length)];

  for (const dependency of options.dependencies) {
    const row = [
      `**${escapeMarkdown(dependency.name)}**`,
      dependency.scope === 'production' ? 'dependencies' : 'devDependencies',
      `\`${dependency.requestedVersion}\``,
    ];

    if (options.securityStatusAvailable) {
      row.push(renderSecurityStatus(findingsByPackage.get(dependency.name) ?? []));
    }

    if (options.includeLatestVersion) {
      row.push(renderLatestVersion(latestByPackage.get(dependency.name)));
    }

    lines.push(renderRow(row));
  }

  if (!options.securityStatusAvailable && options.includeStatusNote) {
    lines.push('', '> Security status unavailable because no scanner report was provided or parsed.');
  }

  lines.push('');

  return {
    markdown: `${lines.join('\n')}\n`,
    dependencyCount: options.dependencies.length,
    latestVersionCount: options.latestVersions.filter((latestVersion) => latestVersion.version).length,
    issueCount: options.findings.length,
    securityStatusAvailable: options.securityStatusAvailable,
  };
}

function groupFindings(findings: SecurityFinding[]): Map<string, SecurityFinding[]> {
  const grouped = new Map<string, SecurityFinding[]>();

  for (const finding of findings) {
    const existing = grouped.get(finding.packageName) ?? [];
    existing.push(finding);
    grouped.set(finding.packageName, existing);
  }

  return grouped;
}

function renderHeader(headers: string[]): string {
  return renderRow(headers);
}

function renderAlignment(columnCount: number): string {
  return renderRow(Array.from({ length: columnCount }, () => ':---'));
}

function renderRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

function renderSecurityStatus(findings: SecurityFinding[]): string {
  if (findings.length === 0) return 'No known issues';

  const severityCounts = severityOrder
    .map((severity) => {
      const count = findings.filter((finding) => finding.severity === severity).length;
      return count > 0 ? `${count} ${severity}` : undefined;
    })
    .filter(Boolean);

  if (severityCounts.length === 0) return `${findings.length} issue${findings.length === 1 ? '' : 's'}`;

  return severityCounts.join(', ');
}

function renderLatestVersion(version: string | undefined): string {
  return version ? `\`${version}\`` : 'Unavailable';
}

function escapeMarkdown(value: string): string {
  return value.replace(/\|/g, '\\|');
}
