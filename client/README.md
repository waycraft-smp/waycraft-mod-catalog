# Waycraft SMP — Running Mods

A responsive catalog of the mods included in the Waycraft SMP setup.

## Setup

The mod list is generated using **AutoMod**. Before running the client, you must first generate the latest mod data.

1. Navigate to the `AutoMod` folder and follow the instructions in its [README](../AutoMod/README.md) to generate the mod list.
2. Once the generation is complete, navigate to the `client` folder and run:

   ```powershell
   npm.cmd run sync:mods
   ```

This command copies the generated `mods.json` from `AutoMod/output/` into `client/src/data/`, making it available to the website.

The client uses this local copy, so the deployed site does not need access to the `AutoMod` folder.