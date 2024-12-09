const { EmbedBuilder, Colors } = require('discord.js');

// Constants
const ROLE_MAPPING = {
    "🚀": "Star Citizen News",
    "🤔": "IT Curious",
};

const CHANNEL_ID = '1221094114347581450';
const GUILD_ID = "1042646038944698408";

module.exports = {
    // Function to handle adding roles
    handleReactionAdd: async (reaction, user, client) => {
        if (user.bot) return; // Ignore reactions from the bot itself

        if (reaction.message.channel.id === CHANNEL_ID) {
            const roleName = ROLE_MAPPING[reaction.emoji.name];
            if (roleName) {
                const guild = client.guilds.cache.get(GUILD_ID);
                const role = guild.roles.cache.find(role => role.name === roleName);
                if (role) {
                    const member = guild.members.cache.get(user.id);
                    if (member) {
                        await member.roles.add(role);
                        const embed = new EmbedBuilder()
                            .setTitle("You've received your role!")
                            .setDescription(`Hello ${user.toString()}, you have been given the **${roleName}** role!\n\nYou can remove the role at any time by simply removing your reaction on the message.`)
                            .setColor(Colors.Blue);
                        await user.send({ embeds: [embed] });
                    }
                }
            }
        }
    },

    // Function to handle removing roles
    handleReactionRemove: async (reaction, user, client) => {
        if (user.bot) return; // Ignore reactions from the bot itself

        if (reaction.message.channel.id === CHANNEL_ID) {
            const roleName = ROLE_MAPPING[reaction.emoji.name];
            if (roleName) {
                const guild = client.guilds.cache.get(GUILD_ID);
                const role = guild.roles.cache.find(role => role.name === roleName);
                if (role) {
                    const member = guild.members.cache.get(user.id);
                    if (member) {
                        await member.roles.remove(role);
                    }
                }
            }
        }
    },

    // Function to send the initial message with reactions
    sendRoleMessage: async (client) => {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
            console.log(`Guild with ID ${GUILD_ID} not found.`);
            return;
        }

        const channel = guild.channels.cache.get(CHANNEL_ID);
        if (!channel) {
            console.log(`Channel with ID ${CHANNEL_ID} not found in guild ${guild.name}.`);
            return;
        }

        const message = await channel.send('React to get roles!');
        for (const emoji of Object.keys(ROLE_MAPPING)) {
            await message.react(emoji);
        }
    },
};
