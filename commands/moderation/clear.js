const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages in the channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to clear')
                .setMaxValue(99)
                .setRequired(true)),
    async execute(interaction) {
        // Allowed roles and usernames
        const allowedRoles = ['Fondateur', 'Admin'];
        const allowedUsers = ['mr.skyzz'];

        const member = interaction.member;

        // Check if user has one of the allowed roles or is in the allowed users list
        const hasAllowedRole = member.roles.cache.some(role => allowedRoles.includes(role.name));
        const isAllowedUser = allowedUsers.includes(member.user.username);

        if (!hasAllowedRole && !isAllowedUser) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the amount of messages to clear
        const amount = interaction.options.getInteger('amount');

        // Check if the channel exists and purge messages
        const channel = interaction.channel;
        if (channel) {
            await channel.bulkDelete(amount + 1, true); // +1 to include the command message itself
            const reply = await interaction.reply({ content: `${amount} messages cleared.`, fetchReply: true });

            // React with Unicode emoji
            await reply.react('🗑️');

            // Create reaction collector
            const collectorFilter = (reaction, user) => {
                return reaction.emoji.name === '🗑️' && user.id === interaction.user.id;
            };

            const collector = reply.createReactionCollector({ filter: collectorFilter, time: 10000 }); // 10 sec

            let messageCollected = false;

            collector.on('collect', async _ => {
                // Set the flag to false when the message is collected
                messageCollected = true;
                await reply.delete();
                collector.stop();
            });

            collector.on('end', async () => {
                // If the message has been manually deleted, there's no need to attempt reaction removal
                if (messageCollected) return;

                try {
                    // Check if the message still exists before attempting to remove the reaction
                    const fetchedMessage = await channel.messages.fetch(reply.id);
                    if (fetchedMessage) {
                        const reaction = fetchedMessage.reactions.cache.get('🗑️');
                        if (reaction) {
                            await reaction.remove();
                        }
                    }
                } catch (error) {
                    console.error('Error removing reaction:', error);
                }
                console.log(`[LOG] Collector expired in channel [${channel.name}] : ID ${channel.id}`);
            });



        } else {
            await interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }
    }
};
