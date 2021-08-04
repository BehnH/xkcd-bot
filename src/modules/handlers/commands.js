// Import Dependencies
const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

/**
 * Start the command handler and load all the commands.
 *
 * @param {Object} bot The client which is used to transact between this app & Discord
 *
 * @returns {Promise<Number>} The amount of commands loaded
 */
exports.initCommands = (bot) => {
    return new Promise((resolve) => {
        // Create command and alias collections
        bot.commands = new Collection();

        // Get all the commands
        const commands = readdirSync(`./commands`).filter(file => file.endsWith(".js"));

        // Loop through the commands
        for (const file of commands) {
            try {
                // Get the command file
                const props = require(`../../commands/${file}`);
                // Set the command path
                props.path = `../../commands/${file}`;
                // Add the command to the collection
                bot.commands.set(props.info.name, props);

            } catch (err) {
                // Log the error in case loading a command fails
                bot.logger.error(`Failed to load ${file}`);
                bot.logger.error(err.stack);
            }
        }

        // Resolve the amount of commands that were added
        resolve(bot.commands.size);
    });
};

exports.registerCommands = (bot) => {
    return new Promise((resolve, reject) => {
        const arr = [];
        const commands = Array.from(bot.commands.values());

        for (const data of commands) {

            arr.push({
                name: data.info.name,
                description: data.info.description,
                options: data.info.options
            });
        }

        // Set the guild commands
        bot.application.commands.set(arr).then(() => {
            resolve(true);
        }).catch(err => {
            reject(err);
        });
    });
};