// Import dependencies
const { Client } = require("discord.js"),
ora = require("ora");
const { initCommands } = require("./modules/handlers/commands");
const { initEvents } = require("./modules/handlers/events");

// Import handlers

// Create the bot client
const bot = new Client({
    partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "MESSAGE",
        "USER"
    ],
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES"
    ]
});

// Import prototypes
//require("./modules/functions/prototypes")();

// Init function
const initBot = async () => {

    // Send the command message and load all the commands
    const commandMessage = ora("Loading commands...").start(),
    cmds = await initCommands(bot);

    commandMessage.stopAndPersist({
        symbol: "✔️",
        text: ` Loaded ${cmds} commands.`,
    });

    // Send the event message and load the events
    const eventMessage = ora("Loading events...").start(),
    evts = await initEvents(bot);

    // Update the event message
    eventMessage.stopAndPersist({
        symbol: "✔️",
        text: ` Loaded ${evts} events.`,
    });

    // Send the login message
    const loginMessage = ora("Logging into the Discord API...").start();

    // Login to the Discord API and update the login message
    bot.login(bot.config.general.token)
        .then(() => {
            loginMessage.stopAndPersist({
                symbol: "✔️",
                text: " Successfully logged into the Discord API!",
            });
        }).catch(err => {
            loginMessage.stopAndPersist({
                symbol: "❌",
                text: `Error while logging into discord: ${err}`,
            });
        });
};

// Run the init function
initBot();