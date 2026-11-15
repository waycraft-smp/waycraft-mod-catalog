const SERVER_PROJECT_IDS = new Set(['waycraft_joinfix', 'waycraftsmp-info']);

function getEnvironmentOrder(environments = ['unknown']) {
  const hasClient = environments.includes('client');
  const hasServer = environments.includes('server');
  if (hasClient && !hasServer) return 0;
  if (hasServer && !hasClient) return 1;
  if (hasClient && hasServer) return 2;
  return 3;
}

function compareEmptyFirst(left, right) {
  return Number(left.length > 0) - Number(right.length > 0);
}

function compareTags(left, right) {
  const getTagOrder = tags => {
    if (tags.includes('waycraft')) return 2;
    if (tags.includes('library')) return 1;
    return 0;
  };

  const orderDifference = getTagOrder(left.tags) - getTagOrder(right.tags);
  if (orderDifference !== 0) return orderDifference;
  return left.tags
    .join(',')
    .localeCompare(right.tags.join(','), undefined, { sensitivity: 'base' });
}

export function classifyMods(
  jars,
  modrinthData,
  manualTags = {},
  manualSupportedEnvironments = {}
) {
  const mods = jars.map(({ metadata, sha512 }) => {
    const version = modrinthData.versionsByHash[sha512];
    const project = version?.project_id ? modrinthData.projectsById[version.project_id] : null;
    const serverProject = SERVER_PROJECT_IDS.has((metadata.id ?? project?.id ?? '').toLowerCase());
    const modId = metadata.id ?? project?.id ?? null;
    const manualEnvironments = manualSupportedEnvironments[modId];
    const supportedEnvironments =
      metadata.supportedEnvironments.includes('unknown') &&
      Array.isArray(manualEnvironments) &&
      manualEnvironments.length > 0
        ? manualEnvironments
        : metadata.supportedEnvironments;
    const tags = [
      ...new Set([
        ...(project?.categories ?? []),
        ...(project?.additional_categories ?? []),
        ...(serverProject ? ['waycraft'] : []),
        ...(Array.isArray(manualTags[modId]) ? manualTags[modId] : []),
      ]),
    ];

    return {
      id: modId,
      name: project?.title ?? metadata.name,
      description: project?.description ?? metadata.description,
      url: project?.slug
        ? `https://modrinth.com/${project.project_type ?? 'mod'}/${project.slug}`
        : metadata.homepage,
      iconUrl: project?.icon_url ?? null,
      supportedEnvironments,
      tags,
    };
  });

  return mods.sort(
    (left, right) =>
      compareEmptyFirst(
        left.supportedEnvironments.filter(environment => environment !== 'unknown'),
        right.supportedEnvironments.filter(environment => environment !== 'unknown')
      ) ||
      compareEmptyFirst(left.tags, right.tags) ||
      getEnvironmentOrder(left.supportedEnvironments) -
        getEnvironmentOrder(right.supportedEnvironments) ||
      (left.tags.length > 0 && right.tags.length > 0 ? compareTags(left, right) : 0) ||
      (left.id ?? '').localeCompare(right.id ?? '', undefined, { sensitivity: 'base' })
  );
}
