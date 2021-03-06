const { InteractionResponseType } = require('discord-interactions');
const { createEmbed } = require('../utils/embed');

module.exports = {
    name: 'github',
    description: 'Get a link to the open-source GitHub repository for XKCD Bot',
    execute: async ({ response }) => response({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                createEmbed(
                    'GitHub',
                    'View the DNS over Discord source code on GitHub at https://github.com/WaitroseDev/XKCD-Bot',
                ),
            ],
        },
    }),
};
