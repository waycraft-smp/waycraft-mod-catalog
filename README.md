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
| `supportedEnvironments` | Detected or manually assigned environments. |
| `tags` | Modrinth categories and manual tags. |

Results with unclassified environments appear first. Within each environment group, untagged entries appear before tagged ones; remaining entries are ordered by environment, tag priority, and ID. `library` and `waycraft` have special tag-sorting priority.

## Manual tags

Edit `automod/data/addTagsManual.json` to assign additional tags:

```json
{
  "bobby-mod": ["utility", "optimization"],
}
```

Manual tags are merged with Modrinth categories, not replaced by them.

Available categories are based on Modrinth tags found in the catalog. `waycraft` is a custom tag for recognized Waycraft projects.

## Manual supported environments

When AutoMod cannot determine a mod's environment from its JAR metadata, it keeps the mod in `output/mods.json` with `supportedEnvironments: ["unknown"]` and, when the mod has an ID, adds it to `data/addSupportedEnvironmentsManual.json` with an empty array.

Fill in the array with `"client"`, `"server"`, or both, then run AutoMod again:

```json
{
  "client-only-mod": ["client"],
  "server-only-mod": ["server"],
  "both-sides-mod": ["client", "server"]
}
```

An empty array means the environment is still pending, so the mod remains in the output as `"unknown"`. Manual values apply only when the JAR metadata does not already identify an environment.

## Project structure

- `src/cli/` — Command-line interface and output.
- `src/analyzer/` — JAR analysis, metadata processing, tags, and sorting.
- `src/services/` — Modrinth API integration.
- `data/addTagsManual.json` — Manual tags, tracked by Git.
- `data/addSupportedEnvironmentsManual.json` — Manual environments for mods without detectable JAR metadata.
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