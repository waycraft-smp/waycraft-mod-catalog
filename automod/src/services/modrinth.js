const MODRINTH_API = "https://api.modrinth.com/v2";
const USER_AGENT = "AutoMod-json/0.1.0 (local Minecraft mod analyzer)";
const HASH_BATCH_SIZE = 100;
const PROJECT_BATCH_SIZE = 50;

function splitIntoBatches(items, batchSize) {
  const batches = [];

  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize));
  }

  return batches;
}

async function fetchVersionsByHash(hashes) {
  const versionsByHash = {};

  for (const batch of splitIntoBatches(hashes, HASH_BATCH_SIZE)) {
    const response = await fetch(`${MODRINTH_API}/version_files`, {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hashes: batch, algorithm: "sha512" }),
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 404) continue;
    if (!response.ok) {
      throw new Error(`Modrinth respondió con HTTP ${response.status}.`);
    }

    Object.assign(versionsByHash, await response.json());
  }

  return versionsByHash;
}

async function fetchProjects(projectIds) {
  const projectsById = {};
  const uniqueIds = [...new Set(projectIds)];

  for (const batch of splitIntoBatches(uniqueIds, PROJECT_BATCH_SIZE)) {
    const query = new URLSearchParams({ ids: JSON.stringify(batch) });
    const response = await fetch(`${MODRINTH_API}/projects?${query}`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`La búsqueda de proyectos de Modrinth respondió con HTTP ${response.status}.`);
    }

    for (const project of await response.json()) {
      projectsById[project.id] = project;
    }
  }

  return projectsById;
}

export async function lookupModrinth(jars) {
  let versionsByHash = {};
  let projectsById = {};
  let error = null;

  try {
    const hashes = [...new Set(jars.map((jar) => jar.sha512))];
    versionsByHash = await fetchVersionsByHash(hashes);

    const projectIds = Object.values(versionsByHash)
      .map((version) => version.project_id)
      .filter(Boolean);
    projectsById = await fetchProjects(projectIds);
  } catch (lookupError) {
    error = lookupError.message;
  }

  return { versionsByHash, projectsById, error };
}
