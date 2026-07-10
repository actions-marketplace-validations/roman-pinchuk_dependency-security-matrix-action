import * as core from '@actions/core';
import type { ActionInputs } from './types.js';

export function getInputs(): ActionInputs {
  return {
    scanner: core.getInput('scanner') || 'snyk',
    scannerReport: core.getInput('scanner-report'),
    scannerReportRequired: getBooleanInput('scanner-report-required'),
    fallbackWithoutScanner: getBooleanInput('fallback-without-scanner'),
    manifest: core.getInput('manifest') || 'package.json',
    manifestType: core.getInput('manifest-type') || 'npm',
    readme: core.getInput('readme') || 'README.md',
    startMarker: core.getInput('start-marker') || '<!-- START_MATRIX_TABLE -->',
    endMarker: core.getInput('end-marker') || '<!-- END_MATRIX_TABLE -->',
    includeDependencies: getBooleanInput('include-dependencies'),
    includeDevDependencies: getBooleanInput('include-dev-dependencies'),
    includeLatestVersion: getBooleanInput('include-latest-version'),
    includeStatusNote: getBooleanInput('include-status-note'),
    heading: core.getInput('heading') || '## Dynamic Dependency & Security Matrix',
    failOnMissingMarkers: getBooleanInput('fail-on-missing-markers'),
  };
}

function getBooleanInput(name: string): boolean {
  return core.getBooleanInput(name, { required: false });
}
