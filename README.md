# Waycraft SMP — Running Mods

A web-based catalog of the mods included in the Waycraft SMP setup, automatically generated using AutoMod and Modrinth metadata.

## Project structure

This project consists of two components:

- **AutoMod** — A command-line tool that scans Minecraft JAR files, retrieves project information from Modrinth, and generates the mod catalog.
- **Client** — A responsive website that displays the generated mod catalog, organized by categories and tags.

---

# AutoMod

A command-line tool for generating mod metadata from Minecraft JAR files.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later.
- An internet connection to query Modrinth.

## Installation

Open the `automod` folder in PowerShell and run:

```powershell
npm.cmd install
```

This installs `adm-zip`, which is used to read metadata from `.jar` files.

## Usage

Start AutoMod:

```powershell
npm.cmd start
```

Enter the path to your Minecraft mods folder when prompted.

The last scanned path is saved locally in `data/last-folder.txt`. Press Enter to reuse it.

You can also provide the path directly:

```powershell
npm.cmd start -- "C:\path\to\mods"
```

AutoMod scans the selected folder and its subfolders for `.jar` files, retrieves available metadata, processes tags, and generates:

`automod/output/mods.json`

## Output format

Each object in `mods.json` can include:

| Field | Description |
| --- | --- |
| `id` | Mod ID, when available. |
| `name` | Project name. |
| `description` | Project description or local JAR description. |
| `url` | Project page or available local link. |
| `iconUrl` | Icon URL, when available. |
| `supportedEnvironments` | Detected supported environments. |
| `tags` | Modrinth categories combined with manual tags. |

### Sorting

Results are ordered by environment, tags, and then ID alphabetically.

Additional sorting rules:

- Entries without tags appear first.
- The `library` tag is placed near the end.
- The `waycraft` tag is always placed last.

The console summary displays the total number of entries and counts for Waycraft mods, libraries, regular mods, and entries without tags.

## Manual tags

Edit `automod/data/addTagsManual.json` to assign additional tags to mods:

```json
{
  "bobby": ["utility", "optimization"],
  "mod-id": ["my-tag", "another-tag"]
}
```

Manual tags are merged with Modrinth tags; they do not replace them.

When a mod has no automatic tags, its ID is added with an empty list so you can assign tags manually. Existing entries are preserved.

### Available tags

Modrinth categories currently found in the mod list:

`adventure`, `cursed`, `decoration`, `economy`, `equipment`, `food`, `game-mechanics`, `library`, `magic`, `management`, `minigame`, `mobs`, `optimization`, `social`, `storage`, `technology`, `transportation`, `utility`, `worldgen`.

`waycraft` is a custom tag assigned to recognized Waycraft projects.

## AutoMod project structure

- `src/cli/` — Command-line input, console summary, and file output.
- `src/analyzer/` — JAR reading, metadata fixes, tag merging, and sorting.
- `src/services/` — Modrinth API requests.
- `data/addTagsManual.json` — Manual tags, tracked by Git.
- `data/last-folder.txt` — Last scanned folder, ignored by Git.
- `output/mods.json` — Generated results, ignored by Git.

---

# Client

A responsive web application that displays the mods included in the Waycraft SMP setup.

Categories and navigation are generated from mod tags.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later.
- AutoMod-generated `mods.json` to populate the catalog.

## Installation

Open the `client` folder in PowerShell and run:

```powershell
npm.cmd install
```

## Development

Start the development server:

```powershell
npm.cmd run dev
```

## Client project structure

- `src/layout/` — Server header and tag-based category navigation.
- `src/pages/runningmod/` — Mod list and cards.
- `src/data/mods.json` — Local mod data used by the website.
- `scripts/syncMods.js` — Synchronizes the latest AutoMod output.
- `public/` — Site icon and other static assets.

---

# Updating the mod catalog

AutoMod is the source of truth for mod metadata and tags. The client uses a local copy of its generated output.

Whenever the mod list needs updating, follow these steps:

**1. Generate the latest data**

Navigate to `automod` and run AutoMod following the instructions above.

This generates `automod/output/mods.json`.

**2. Synchronize the client**

Navigate to `client` and run:

```powershell
npm.cmd run sync:mods
```

This copies `automod/output/mods.json` into `client/src/data/mods.json`.

**3. Commit the changes**

The synchronized JSON file is part of the client project, so it must be included when committing changes.

The deployed website does not need access to the AutoMod folder.