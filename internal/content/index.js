const fs = require("fs");
const { exec } = require("shelljs");
const Parser = require('rss-parser');

module.exports.FetchUpdate = async function (rssUrl) {
    const parser = new Parser();
    const rssUpdate = await parser.parseURL(rssUrl);
    const result = [];
    rssUpdate.items.forEach(item => {
        result.push({
            title: item.title,
            url: item.link
        })
    });
    return result;
};

const commit = (
    message,
    name = "Rui Bot",
    email = "rui-bot@users.noreply.github.com"
) => {
    exec(`git config --global user.email "${email}"`);
    exec(`git config --global user.name "${name}"`);
    exec(`git add .`);
    exec(`git commit -m "${message.replace(/\"/g, "''")}"`);
};

module.exports.FilterAndWriteUpdate = async function (site, incomingContents) {
    const filename = `./${site.title.toLowerCase()}.json`;
    if (!fs.existsSync(filename)) {
        fs.appendFileSync(filename, JSON.stringify(incomingContents));
        commit(`updating site resource ${site.title}`)
        return incomingContents;
    }

    const data = fs.readFileSync(filename);
    const currentContents = JSON.parse(data.toString());
    const updatedContents = [];

    for (const incomingContent of incomingContents) {
        let update = true
        for (const currentContent of currentContents) {
            if (currentContent.url === incomingContent.url) update = false;
        }
        if (update) {
            updatedContents.push({
                title: incomingContent.title,
                url: incomingContent.url,
            })
        }
    }

    if (updatedContents) {
        fs.writeFileSync(filename, JSON.stringify(incomingContents));
        commit(`updating site resource ${site.title}`)
    }

    return updatedContents;
}