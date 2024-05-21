const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const roleManager = require('./scripts/role_manager'); // Import the role_manager module

dotenv.config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, async readyClient => { // Mark the callback as async
    console.log(`[APP] Ready! Logged in as ${readyClient.user.tag}`);
    await roleManager.sendRoleMessage(client); // Call sendRoleMessage with the client instance
});

//* Loading Commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//* Handling Commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

//* Event Listeners for role management
client.on('messageReactionAdd', async (reaction, user) => {
    await roleManager.handleReactionAdd(reaction, user, client);
});

client.on('messageReactionRemove', async (reaction, user) => {
    await roleManager.handleReactionRemove(reaction, user, client);
});

//* Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
