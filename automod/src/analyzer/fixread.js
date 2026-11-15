import path from 'node:path';

// Recuperación para estos JAR reportados: alcocraftplus, BetterGrassify,
// Entity Model Features, Entity Texture Features, EuphoriaPatcher y
// rotten-flesh-to-leather. Si aparece otro mod con JSON inválido, se intenta
// la misma reparación genérica cuando se identifican caracteres de control.
const REPORTED_MODS = [
  'alcocraftplus-26.1.2-2.1.3-fabric.jar',
  'BetterGrassify-1.8.7+fabric.26.1.2.jar',
  'entity_model_features-3.3.12-26.1-fabric.jar',
  'entity_texture_features-7.2.7-26.1-fabric.jar',
  'EuphoriaPatcher-1.10.5-r5.9.3-fabric.jar',
  'rotten-flesh-to-leather-6.0.0.jar',
];

function escapeControlCharactersInStrings(jsonText) {
  let result = '';
  let inString = false;
  let escaped = false;

  for (const character of jsonText) {
    const code = character.charCodeAt(0);

    if (inString && code < 0x20) {
      result += `\\u${code.toString(16).padStart(4, '0')}`;
      continue;
    }

    result += character;
    if (escaped) {
      escaped = false;
    } else if (character === '\\' && inString) {
      escaped = true;
    } else if (character === '"') {
      inString = !inString;
    }
  }

  return result;
}

export function parseFabricMetadata(jsonText, jarPath) {
  const normalizedText = jsonText.replace(/^\uFEFF/, '');

  try {
    return JSON.parse(normalizedText);
  } catch (originalError) {
    const fileName = path.basename(jarPath);
    const isReportedMod = REPORTED_MODS.includes(fileName);
    const repairedText = escapeControlCharactersInStrings(normalizedText);

    if (!isReportedMod && repairedText === normalizedText) throw originalError;

    try {
      return JSON.parse(repairedText);
    } catch (repairError) {
      if (isReportedMod) {
        throw new Error(
          `No se pudo reparar fabric.mod.json de ${fileName}: ${repairError.message}`
        );
      }
      throw originalError;
    }
  }
}
