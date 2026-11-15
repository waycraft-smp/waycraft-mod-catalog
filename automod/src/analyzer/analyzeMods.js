import path from 'node:path';
import { classifyMods } from './classifyMods.js';
import { lookupModrinth } from '../services/modrinth.js';
import { readJar } from './readJar.js';

export async function analyzeMods(jarPaths, manualTags = {}, manualSupportedEnvironments = {}) {
  const readableJars = [];
  const skipped = [];

  for (const jarPath of jarPaths) {
    try {
      readableJars.push(await readJar(jarPath));
    } catch (error) {
      skipped.push({ file: path.basename(jarPath), reason: error.message });
    }
  }

  if (readableJars.length === 0) {
    return { mods: [], skipped, modrinthError: null };
  }

  const modrinthData = await lookupModrinth(readableJars);
  const mods = classifyMods(readableJars, modrinthData, manualTags, manualSupportedEnvironments);

  return {
    mods,
    skipped,
    modrinthError: modrinthData.error,
  };
}
