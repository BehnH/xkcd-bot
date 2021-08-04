const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const { getSettings, getPerms } = require("../database/mongo");
const { checkBlacklist } = require("../modules/functions/moderation");
const { checkPerms, checkSelf } = require("../modules/functions/permissions");

module.exports = async (bot, interaction) => {

    if (interaction.isCommand()) {
        // Return if the user is a bot
        if (interaction.user.bot)
            return;

        // If the member isn't found try to fetch it
        if (interaction.guild && !interaction.member)
            await interaction.guild.members.fetch(interaction.user).catch(() => {});

        // Import the interaction functions
        require("../modules/functions/interactions")(interaction);

        // Get the command
        const cmd = bot.commands.get(interaction.commandName);

        // If the command doesn't exist return an error
        if (!cmd)
            return interaction.error({ content: "The command you ran wasn't found!", ephemeral: true });

        // Try to run the command
        try {
            // Run the command
            await cmd.run(bot, interaction);
        } catch (err) {

            // Send the error message to the user
            interaction.error({ content: stripIndents(`An error occurred while running the command: \`${err}\`

            ⚠️ If this issue persists please report it on our GitHub: https://github.com/WaitroseDev/xkcd-bot`), ephemeral: true });
        }
    }

};
