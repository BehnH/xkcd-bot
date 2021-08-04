// Import Dependencies
const ora = require("ora");
const { registerCommands } = require("../modules/handlers/commands");

module.exports = async bot => {

    // Send a spacer
    console.log(" ");

    // Send the ready message
    const rdyMsg = ora("Getting bot ready...").start();

    // Set the bots status
    await bot.user.setPresence({ activities: [{ name: `/help | XKCD Comics`, type: "WATCHING" }], status: "online"});
    // Register all the slash commands if the bot isn't in a dev environment
    await registerCommands(bot)

    // Stop and update the ready message
    rdyMsg.stopAndPersist({
        symbol: "✔️",
        text: ` ${bot.user.username} is online on ${bot.guilds.cache.size} servers and serving ${bot.users.cache.size} users!`
    });

    // Send a spacer
    console.log(" ");
};