import { readFile, writeFile } from "node:fs/promises";

export async function loadManualMap(filePath) {
  try {
    const data = JSON.parse(await readFile(filePath, "utf8"));
    if (!data || Array.isArray(data) || typeof data !== "object") {
      throw new Error("El archivo debe contener un objeto JSON con IDs como claves.");
    }
    return data;
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`No se pudo leer ${filePath}: ${error.message}`);
  }
}

export function addManualEntry(data, modId, value) {
  if (!modId || Object.hasOwn(data, modId)) return false;
  data[modId] = value;
  return true;
}

export function writeManualMap(filePath, data) {
  return writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
