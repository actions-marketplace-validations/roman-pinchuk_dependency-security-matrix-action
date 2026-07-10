import { describe, expect, it } from 'vitest';
import { parseNpmManifest } from '../src/manifests/npm.js';

describe('parseNpmManifest', () => {
  it('reads production and development dependencies', () => {
    const dependencies = parseNpmManifest(
      JSON.stringify({
        dependencies: { pino: '^10.0.0' },
        devDependencies: { '@playwright/test': '1.61.1' },
      }),
      { includeDependencies: true, includeDevDependencies: true },
    );

    expect(dependencies).toEqual([
      { name: '@playwright/test', requestedVersion: '1.61.1', scope: 'development' },
      { name: 'pino', requestedVersion: '^10.0.0', scope: 'production' },
    ]);
  });

  it('can exclude development dependencies', () => {
    const dependencies = parseNpmManifest(
      JSON.stringify({
        dependencies: { pino: '^10.0.0' },
        devDependencies: { typescript: '^5.0.0' },
      }),
      { includeDependencies: true, includeDevDependencies: false },
    );

    expect(dependencies).toEqual([{ name: 'pino', requestedVersion: '^10.0.0', scope: 'production' }]);
  });
});
