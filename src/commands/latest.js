const { InteractionResponseType } = require('discord-interactions');
const { editDeferred } = require('../utils/follow-up');
const { getLatestComic } = require('../utils/getters');

module.exports = {
    name: 'dig',
    description: 'Perform a DNS over Discord lookup',
    execute: async ({ interaction, response, wait }) => {

        // Do the processing after acknowledging the Discord command
        wait((async () => {
            const comic = await getLatestComic();

            // Edit the original deferred response
            await editDeferred(interaction, {
                content: `\`\`\`json\n${comic}\`\`\``
            });
        })().catch(err => {
            // Log & re-throw any errors
            console.error(err);
            throw err;
        }));

        // Let Discord know we're working on the response
        return response({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });
    },
};
