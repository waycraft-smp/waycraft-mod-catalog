import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { analyzeMods } from "../analyzer/analyzeMods.js";

const IGNORED_FOLDERS = new Set(["node_modules", ".git", "output"]);
const DATA_DIRECTORY = path.resolve("data");
const LAST_FOLDER_FILE = path.join(DATA_DIRECTORY, "last-folder.txt");
const USE_COLOR = Boolean(stdout.isTTY);

function color(text, code) {
  return USE_COLOR ? `\u001b[${code}m${text}\u001b[0m` : text;
}

async function loadLastFolderPath() {
  try {
    return (await readFile(LAST_FOLDER_FILE, "utf8")).trim() || null;
  } catch {
    return null;
  }
}

async function askForFolderPath(previousFolderPath) {
  const terminal = createInterface({ input: stdin, output: stdout });
  const hint = previousFolderPath
    ? ` (Enter para repetir: ${previousFolderPath})`
    : "";

  try {
    const answer = (await terminal.question(`Ruta de la carpeta con los mods .jar${hint}: `)).trim();
    return answer || previousFolderPath;
  } finally {
    terminal.close();
  }
}

async function collectJarPaths(folderPath) {
  const jarPaths = [];

  async function visit(currentFolder) {
    const entries = await readdir(currentFolder, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentFolder, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORED_FOLDERS.has(entry.name)) {
          await visit(entryPath);
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".jar")) {
        jarPaths.push(entryPath);
      }
    }
  }

  await visit(folderPath);
  return jarPaths.sort((left, right) => left.localeCompare(right));
}

async function main() {
  const previousFolderPath = await loadLastFolderPath();
  const inputPath = process.argv[2] || await askForFolderPath(previousFolderPath);

  if (!inputPath) {
    throw new Error("No se indicó la ruta de la carpeta.");
  }

  const folderPath = path.resolve(inputPath.replace(/^[\"']|[\"']$/g, ""));
  const folderInfo = await stat(folderPath);

  if (!folderInfo.isDirectory()) {
    throw new Error("La ruta debe apuntar a una carpeta.");
  }

  const jarPaths = await collectJarPaths(folderPath);

  if (jarPaths.length === 0) {
    throw new Error("No encontré archivos .jar en esa carpeta.");
  }

  console.log(`\n${color("AutoMod-json", "1;36")}`);
  console.log(color("─".repeat(36), "90"));
  console.log(`Carpeta: ${folderPath}`);
  console.log(`Archivos .jar encontrados: ${jarPaths.length}`);
  console.log("Analizando y consultando Modrinth...\n");

  await mkdir(DATA_DIRECTORY, { recursive: true });
  const manualTagsPath = path.join(DATA_DIRECTORY, "addTagsManual.json");
  let manualTags = {};
  try {
    manualTags = JSON.parse(await readFile(manualTagsPath, "utf8"));
    if (!manualTags || Array.isArray(manualTags) || typeof manualTags !== "object") {
      throw new Error("El archivo debe contener un objeto JSON con IDs como claves.");
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw new Error(`No se pudo leer ${manualTagsPath}: ${error.message}`);
  }

  const result = await analyzeMods(jarPaths, manualTags);
  let manualTagsChanged = false;
  for (const mod of result.mods) {
    if (mod.id && mod.tags.length === 0 && !Object.hasOwn(manualTags, mod.id)) {
      manualTags[mod.id] = [];
      manualTagsChanged = true;
    }
  }

  const outputDirectory = path.resolve("output");
  const outputPath = path.join(outputDirectory, "mods.json");
  const mods = result.mods;

  await mkdir(outputDirectory, { recursive: true });
  await mkdir(DATA_DIRECTORY, { recursive: true });
  await Promise.all([
    writeFile(outputPath, `${JSON.stringify(mods, null, 2)}\n`, "utf8"),
    writeFile(LAST_FOLDER_FILE, `${folderPath}\n`, "utf8"),
    ...(manualTagsChanged
      ? [writeFile(manualTagsPath, `${JSON.stringify(manualTags, null, 2)}\n`, "utf8")]
      : []),
  ]);

  const summary = {
    "Mods Waycraft": 0,
    Librerías: 0,
    Mods: 0,
    "Sin etiquetas": 0,
    "Total identificado": result.mods.length,
  };

  for (const mod of result.mods) {
    if (mod.tags.length === 0) {
      summary["Sin etiquetas"] += 1;
    }

    if (mod.tags.includes("waycraft")) {
      summary["Mods Waycraft"] += 1;
    } else if (mod.tags.includes("library")) {
      summary.Librerías += 1;
    } else {
      summary.Mods += 1;
    }
  }

  console.log(`\n${color("Resumen de resultados", "1;36")}`);
  const summaryWidth = Math.max(...Object.keys(summary).map((label) => label.length));
  for (const [label, count] of Object.entries(summary)) {
    console.log(`  ${label.padEnd(summaryWidth)}  ${count}`);
  }

  console.log(`${color("JSON generado:", "1;32")} ${outputPath}`);

  if (result.skipped.length > 0) {
    console.log(color(`\nNo se pudieron leer ${result.skipped.length} archivos`, "1;33"));
    for (const { file, reason } of result.skipped) {
      console.log(`  • ${file}: ${reason}`);
    }
  }

  if (result.modrinthError) {
    console.log(color("\nAviso: Modrinth no respondió.", "1;33"));
    console.log(`Se usaron los metadatos locales disponibles. ${result.modrinthError}`);
  }
}

main().catch((error) => {
  console.error(color("Error:", "1;31"), error.message);
  process.exitCode = 1;
});
