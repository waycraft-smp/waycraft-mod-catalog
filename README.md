# Waycraft SMP — Running Mods

A web catalog of the mods included in the Waycraft SMP modpack. **AutoMod** generates the catalog from Minecraft JAR files, and the **Client** displays it.

## Folders

- **AutoMod** (`automod/`) — Scans mods, retrieves metadata from Modrinth, and generates `output/mods.json`.
- **Client** (`client/`) — Displays the catalog as a responsive website, with navigation generated from mod tags.

---

### AutoMod: Requirements and installation

- [Node.js](https://nodejs.org/) 18 or later.
- Internet connection.

In PowerShell, open `automod/` and install the dependencies:

```powershell
npm install
```

### Run a scan

From `automod/`, run:

```powershell
npm start
```

Enter the Minecraft mods folder when prompted. AutoMod saves the last scanned path in `data/last-folder.txt`; press Enter to reuse it. You can also pass a path directly:

```powershell
npm start -- "C:\path\to\mods"
```

AutoMod scans the folder and its subfolders, retrieves available metadata, processes tags and environments, and writes the catalog to `automod/output/mods.json`.

### Catalog data

Each catalog entry can contain:

| Field                   | Description                                 |
| ----------------------- | ------------------------------------------- |
| `id`                    | Mod ID.                                     |
| `name`                  | Project name.                               |
| `description`           | Project or local JAR description.           |
| `url`                   | Project page or local link.                 |
| `iconUrl`               | Project icon URL.                           |
| `supportedEnvironments` | Detected or manually assigned environments. |
| `tags`                  | Modrinth categories and manual tags.        |

Entries with unclassified environments appear first. Within each environment group, untagged entries appear before tagged ones. Remaining entries are ordered by environment, tag priority, and ID; `library` and `waycraft` have special tag-sorting priority.

### Manual metadata

Available tags for `addTagsManual.json and addSupportedEnvironmentsManual.json` (use the tags that apply to each mod; do not leave the list empty):

```json
{
  "addTagsManual.json": [
    "adventure", "cursed", "decoration", "economy",
    "equipment", "food", "game-mechanics", "library",
    "magic", "management", "mobs", "optimization",
    "social", "storage", "technology", "transportation",
    "utility", "waycraft", "worldgen"
  ]
}
```

```json
{
  "addSupportedEnvironmentsManual.json": ["client", "server"]
}
```


### Updating the catalog

AutoMod generates the catalog, and the Client retrieves it directly from the public GitHub repository. To update the mod list:

1. Run AutoMod to generate the latest `automod/output/mods.json`.
2. Review the generated data.
3. Commit and push the updated JSON file to GitHub.

Alternatively, run `update-catalog.bat` from the repository root. It reads the saved folder from `automod/data/last-folder.txt`, regenerates the catalog, and commits and pushes only `automod/output/mods.json` to `origin/main`. The local branch must be `main`, and GitHub authentication must already be configured.

### AutoMod files

- `src/cli/` — Command-line interface and output.
- `src/analyzer/` — JAR analysis, metadata processing, tags, and sorting.
- `src/services/` — Modrinth API integration.
- `data/addTagsManual.json` — Manual tags (tracked by Git).
- `data/addSupportedEnvironmentsManual.json` — Manual environments for mods without detectable JAR metadata.
- `data/last-folder.txt` — Last scanned path (ignored by Git).
- `output/mods.json` — Generated catalog (tracked by Git).

---

### Client: Requirements and installation

- [Node.js](https://nodejs.org/) 18 or later.
- Internet connection to retrieve the catalog from GitHub.

In PowerShell, open `client/` and install the dependencies:

```powershell
npm install
```

### Development

From `client/`, start the development server:

```powershell
npm run dev
```

### Client files

- `src/layout/` — Header and category navigation.
- `src/pages/runningmod/` — Mod list and cards.
- `public/` — Site icon and static assets.
