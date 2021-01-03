const core = require('@actions/core');
const {LoadSites} = require("./internal/data")
const {FetchUpdate, FilterAndWriteUpdate} = require("./internal/content")
const {BroadcastUpdate} = require("./internal/bot")
const { exec } = require("shelljs");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const sites = LoadSites("rss.yaml");
    for (const site of sites) {
      const content = await FetchUpdate(site.url)
      if (!content) continue;
      const filteredContents = await FilterAndWriteUpdate(site, content)
      BroadcastUpdate({
        site: site,
        contents: filteredContents
      })
    }
    exec("git push");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
