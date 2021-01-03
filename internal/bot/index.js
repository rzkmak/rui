const TelegramBot = require('node-telegram-bot-api')

const TemplateChat = function (customMessage, title, link) {
    return `
${customMessage}
[${title}]
Link: ${link}
`
};

module.exports.BroadcastUpdate = function (siteUpdate) {
    const bot = new TelegramBot(process.env.GITHUB_TOKEN);
    if (!siteUpdate.contents) return;
    siteUpdate.contents.forEach(content => {
        bot.sendMessage(
            `@${siteUpdate.site.chat_id}`,
            TemplateChat(
                siteUpdate.site.custom_message,
                content.title,
                content.url
            )
        ).catch(e => console.log(e));
    });
};