const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { clearQueue, resetPlayer, resetConnection } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the currently playing audio and leaves the voice channel.'),
    async execute(interaction) {
        // Get the voice connection for the guild
        const connection = getVoiceConnection(interaction.guildId);

        // If there's no active voice connection, return a message
        if (!connection) {
            return interaction.reply('There is no active audio playback to stop.');
        }

        // Clear the queue, reset the player, and destroy the connection
        clearQueue();
        resetPlayer();
        connection.destroy();

        // Reset the connection state
        resetConnection();

        // Respond to the interaction
        await interaction.reply('Audio playback stopped and bot left the voice channel.');
    },
};
