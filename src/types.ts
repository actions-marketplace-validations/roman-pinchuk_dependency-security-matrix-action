export type DependencyScope = 'production' | 'development';

export type Dependency = {
  name: string;
  requestedVersion: string;
  scope: DependencyScope;
};

export type SecurityFinding = {
  packageName: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title?: string;
};

export type LatestVersion = {
  packageName: string;
  version?: string;
};

export type ActionInputs = {
  scanner: string;
  scannerReport: string;
  scannerReportRequired: boolean;
  fallbackWithoutScanner: boolean;
  manifest: string;
  manifestType: string;
  readme: string;
  startMarker: string;
  endMarker: string;
  includeDependencies: boolean;
  includeDevDependencies: boolean;
  includeLatestVersion: boolean;
  includeStatusNote: boolean;
  heading: string;
  failOnMissingMarkers: boolean;
};

export type MatrixResult = {
  markdown: string;
  dependencyCount: number;
  latestVersionCount: number;
  issueCount: number;
  securityStatusAvailable: boolean;
};
