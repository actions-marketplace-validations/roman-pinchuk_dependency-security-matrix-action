import type { Dependency } from '../types.js';

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export function parseNpmManifest(
  rawManifest: string,
  options: { includeDependencies: boolean; includeDevDependencies: boolean },
): Dependency[] {
  const manifest = JSON.parse(rawManifest) as PackageJson;
  const dependencies: Dependency[] = [];

  if (options.includeDependencies) {
    dependencies.push(...toDependencies(manifest.dependencies, 'production'));
  }

  if (options.includeDevDependencies) {
    dependencies.push(...toDependencies(manifest.devDependencies, 'development'));
  }

  return dependencies.sort((a, b) => a.name.localeCompare(b.name));
}

function toDependencies(
  dependencyMap: Record<string, string> | undefined,
  scope: Dependency['scope'],
): Dependency[] {
  return Object.entries(dependencyMap ?? {}).map(([name, requestedVersion]) => ({
    name,
    requestedVersion,
    scope,
  }));
}
