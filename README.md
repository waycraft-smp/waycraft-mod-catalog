# Waycraft SMP — Running Mods

A web-based catalog of all mods included in the Waycraft SMP modpack, automatically generated using AutoMod and Modrinth metadata.

## Project structure

This project consists of two components:

- **AutoMod** — Scans Minecraft JAR files, retrieves project metadata from Modrinth, and generates the mod catalog.
- **Client** — A responsive website that displays the catalog, organized by categories and tags.

---

# AutoMod

A command-line tool for generating mod metadata from Minecraft JAR files.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later.
- Internet connection.

## Installation

Open the `automod` folder in PowerShell:

```powershell
npm.cmd install
```

## Usage

Run AutoMod:

```powershell
npm.cmd start
```

Enter your Minecraft mods folder when prompted. The last scanned path is saved locally in `data/last-folder.txt`. Press Enter to reuse it.

Alternatively, provide the path directly:

```powershell
npm.cmd start -- "C:\path\to\mods"
```

AutoMod scans the selected folder and its subfolders, retrieves available metadata, processes tags, and generates:

`automod/output/mods.json`

## Output format

Each entry can contain:

| Field | Description |
| --- | --- |
| `id` | Mod ID. |
| `name` | Project name. |
| `description` | Project or local JAR description. |
| `url` | Project page or local link. |
| `iconUrl` | Project icon URL. |
| `supportedEnvironments` | Detected environments. |
| `tags` | Modrinth categories and manual tags. |

Results are sorted by environment, tags, and ID. Untagged entries appear first, while `library` and `waycraft` have special sorting priority.

## Manual tags

Edit `automod/data/addTagsManual.json` to assign additional tags:

```json
{
  "bobby": ["utility", "optimization"],
  "mod-id": ["my-tag", "another-tag"]
}
```

Manual tags are merged with Modrinth categories, not replaced by them.

Available categories are based on Modrinth tags found in the catalog. `waycraft` is a custom tag for recognized Waycraft projects.

## Project structure

- `src/cli/` — Command-line interface and output.
- `src/analyzer/` — JAR analysis, metadata processing, tags, and sorting.
- `src/services/` — Modrinth API integration.
- `data/addTagsManual.json` — Manual tags, tracked by Git.
- `data/last-folder.txt` — Last scanned path, ignored by Git.
- `output/mods.json` — Generated catalog, tracked by Git.

---

# Client

A responsive web application that displays the Waycraft SMP mod catalog.

Categories and navigation are generated dynamically from mod tags.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later.
- Internet connection to retrieve the catalog from GitHub.

## Installation

Open the `client` folder in PowerShell:

```powershell
npm.cmd install
```

## Development

Start the development server:

```powershell
npm.cmd run dev
```

## Project structure

- `src/layout/` — Header and category navigation.
- `src/pages/runningmod/` — Mod list and cards.
- `public/` — Site icon and static assets.

---

# Updating the mod catalog

AutoMod generates the catalog, while the Client retrieves it directly from the public GitHub repository.

Whenever the mod list needs updating:

1. Run AutoMod to generate the latest `automod/output/mods.json`.
2. Review the generated data.
3. Commit and push the updated JSON file to GitHub.

**Important:** The generated `mods.json` must be included in your Git commits. The website retrieves the latest published version directly from GitHub, so no manual synchronization is required.