import type { Dependency, LatestVersion } from './types.js';

type NpmLatestResponse = {
  version?: unknown;
};

export async function fetchLatestVersions(dependencies: Dependency[]): Promise<LatestVersion[]> {
  return Promise.all(dependencies.map((dependency) => fetchLatestVersion(dependency.name)));
}

async function fetchLatestVersion(packageName: string): Promise<LatestVersion> {
  const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) return { packageName };

    const body = (await response.json()) as NpmLatestResponse;
    return {
      packageName,
      version: typeof body.version === 'string' ? body.version : undefined,
    };
  } catch {
    return { packageName };
  }
}
