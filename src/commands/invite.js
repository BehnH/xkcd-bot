const { InteractionResponseType } = require('discord-interactions');
const { createEmbed } = require('../utils/embed');

module.exports = {
    name: 'invite',
    description: 'Get a link to add XKCD Bot to your server!r',
    execute: async ({ response }) => response({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                createEmbed(
                    'Invite',
                    'Invite XKCD Bot to your server at https://xkcd-bot-prod.forgetfully.dev/invite',
                ),
            ],
        },
    }),
};
