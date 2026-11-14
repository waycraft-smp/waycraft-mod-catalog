import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";
import { parseFabricMetadata } from "./fixread.js";

async function createSha512(filePath) {
  const hash = createHash("sha512");

  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}

function readPackDescription(zip, packMetadata) {
  try {
    const packInfo = JSON.parse(zip.readAsText(packMetadata));
    const description = packInfo.pack?.description;

    if (typeof description === "string") return description;
    return description?.text ?? description?.translate ?? "";
  } catch {
    return "";
  }
}

function readMetadata(zip, jarPath) {
  const fileName = path.basename(jarPath, path.extname(jarPath));
  const fabricEntry = zip.getEntry("fabric.mod.json");

  if (fabricEntry) {
    const metadata = parseFabricMetadata(zip.readAsText(fabricEntry), jarPath);
    const contact = metadata.contact ?? {};

    return {
      id: metadata.id ?? null,
      name: metadata.name ?? fileName,
      version: metadata.version ?? null,
      description: metadata.description ?? "",
      homepage: contact.homepage ?? contact.sources ?? null,
      supportedEnvironments: normalizeEnvironment(metadata.environment),
    };
  }

  const hasOtherModMetadata = [
    "quilt.mod.json",
    "META-INF/mods.toml",
    "META-INF/neoforge.mods.toml",
    "mcmod.info",
  ].some((entryName) => zip.getEntry(entryName));
  const packMetadata = zip.getEntry("pack.mcmeta");
  const hasAssets = zip.getEntries().some((entry) => entry.entryName.startsWith("assets/"));

  if (!hasOtherModMetadata && packMetadata && hasAssets) {
    return {
      id: null,
      name: fileName,
      version: null,
      description: readPackDescription(zip, packMetadata),
      homepage: null,
      supportedEnvironments: ["client"],
    };
  }

  return {
    id: null,
    name: fileName,
    version: null,
    description: "",
    homepage: null,
    supportedEnvironments: ["unknown"],
  };
}

function normalizeEnvironment(environment) {
  if (environment === "*") return ["client", "server"];
  if (environment === "client" || environment === "server") return [environment];
  return ["unknown"];
}

export async function readJar(jarPath) {
  const zip = new AdmZip(jarPath);

  return {
    jarPath,
    metadata: readMetadata(zip, jarPath),
    sha512: await createSha512(jarPath),
  };
}
