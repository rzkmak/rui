const YAML = require('yaml')
const fs = require('fs')

module.exports.LoadSites = function (rssFileName) {
    if (!rssFileName) {
        rssFileName = 'rss.yaml';
    }

    const file = fs.readFileSync(`./${rssFileName}`, 'utf8');
    return YAML.parse(file);
};
