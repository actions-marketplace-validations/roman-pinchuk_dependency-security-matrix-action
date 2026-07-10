import { parseNpmManifest } from './npm.js';
import type { Dependency } from '../types.js';

export function parseManifest(
  manifestType: string,
  rawManifest: string,
  options: { includeDependencies: boolean; includeDevDependencies: boolean },
): Dependency[] {
  if (manifestType === 'npm') return parseNpmManifest(rawManifest, options);

  throw new Error(`Unsupported manifest type: ${manifestType}. Supported manifest types: npm.`);
}
