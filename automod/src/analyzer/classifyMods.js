const SERVER_PROJECT_IDS = new Set(["waycraft_joinfix", "waycraftsmp-info"]);

function getEnvironmentOrder(environments = ["unknown"]) {
  const hasClient = environments.includes("client");
  const hasServer = environments.includes("server");
  if (hasClient && !hasServer) return 0;
  if (hasServer && !hasClient) return 1;
  if (hasClient && hasServer) return 2;
  return 3;
}

function compareTags(left, right) {
  if (left.tags.length === 0 && right.tags.length > 0) return -1;
  if (right.tags.length === 0 && left.tags.length > 0) return 1;

  const getTagOrder = (tags) => {
    if (tags.includes("waycraft")) return 2;
    if (tags.includes("library")) return 1;
    return 0;
  };

  const orderDifference = getTagOrder(left.tags) - getTagOrder(right.tags);
  if (orderDifference !== 0) return orderDifference;
  return left.tags.join(",").localeCompare(right.tags.join(","), undefined, { sensitivity: "base" });
}

export function classifyMods(jars, modrinthData, manualTags = {}) {
  const mods = jars.map(({ metadata, sha512 }) => {
    const version = modrinthData.versionsByHash[sha512];
    const project = version?.project_id
      ? modrinthData.projectsById[version.project_id]
      : null;
    const serverProject = SERVER_PROJECT_IDS.has((metadata.id ?? project?.id ?? "").toLowerCase());
    const modId = metadata.id ?? project?.id ?? null;
    const tags = [
      ...new Set([
        ...(project?.categories ?? []),
        ...(project?.additional_categories ?? []),
        ...(serverProject ? ["waycraft"] : []),
        ...(Array.isArray(manualTags[modId]) ? manualTags[modId] : []),
      ]),
    ];

    return {
      id: modId,
      name: project?.title ?? metadata.name,
      description: project?.description ?? metadata.description,
      url: project?.slug
        ? `https://modrinth.com/${project.project_type ?? "mod"}/${project.slug}`
        : metadata.homepage,
      iconUrl: project?.icon_url ?? null,
      supportedEnvironments: metadata.supportedEnvironments,
      tags,
    };
  });

  return mods.sort((left, right) =>
    Number(left.tags.length > 0) - Number(right.tags.length > 0) ||
    (left.tags.length > 0 && right.tags.length > 0
      ? getEnvironmentOrder(left.supportedEnvironments) - getEnvironmentOrder(right.supportedEnvironments) ||
        compareTags(left, right)
      : 0) ||
    (left.id ?? "").localeCompare(right.id ?? "", undefined, { sensitivity: "base" }),
  );
}
