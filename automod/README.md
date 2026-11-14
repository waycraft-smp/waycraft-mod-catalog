# AutoMod-json

A command-line tool that scans a folder of Minecraft `.jar` files, looks up matching projects on Modrinth, and saves the results to `output/mods.json`.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later.
- An internet connection to query Modrinth.

## Install

Open this project folder in PowerShell and run:

```powershell
npm.cmd install
```

This installs `adm-zip`, which the tool uses to read `.jar` files.

## Run

```powershell
npm.cmd start
```

Enter the folder path when prompted. The last path is saved locally in `data/last-folder.txt`; press Enter to reuse it.

You can also pass the path directly:

```powershell
npm.cmd start -- "C:\path\to\mods"
```

The tool scans the folder and its subfolders for `.jar` files, then creates or updates `output/mods.json`.

## Output

Each object in `mods.json` can include:

| Field | Description |
| --- | --- |
| `id` | Mod ID, when available |
| `name` | Project name |
| `description` | Project description or local JAR description |
| `url` | Project page or available local link |
| `iconUrl` | Icon URL, when available |
| `supportedEnvironments` | Detected supported environments |
| `tags` | Modrinth categories combined with manual tags |

Results are ordered by environment, tags, and then ID alphabetically. Entries without tags appear first. The `library` tag is placed near the end, and `waycraft` is placed last. The console summary shows the total and counts for Waycraft mods, libraries, mods, and entries without tags.

## Manual tags

Edit `data/addTagsManual.json` to add tags for a mod ID:

```json
{
  "bobby": ["utility", "optimization"],
  "mod-id": ["my-tag", "another-tag"]
}
```

Manual tags are merged with Modrinth tags; they do not replace them. When a mod has no automatic tags, its ID is added with an empty list so you can fill it in. Existing entries are preserved.

Modrinth tags currently found in the mod list:

`adventure`, `cursed`, `decoration`, `economy`, `equipment`, `food`, `game-mechanics`, `library`, `magic`, `management`, `minigame`, `mobs`, `optimization`, `social`, `storage`, `technology`, `transportation`, `utility`, `worldgen`.

`waycraft` is a custom tag added to recognized Waycraft projects.

## Project layout

- `src/cli/` — command-line input, summary, and file output.
- `src/analyzer/` — JAR reading, metadata fixes, tag merging, and sorting.
- `src/services/` — Modrinth API requests.
- `data/addTagsManual.json` — manual tags, tracked by Git.
- `data/last-folder.txt` — last scanned folder, ignored by Git.
- `output/mods.json` — generated results, ignored by Git.
