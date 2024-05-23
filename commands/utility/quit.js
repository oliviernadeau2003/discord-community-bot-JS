const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { clearQueue, resetPlayer, resetConnection } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Makes the bot leave the current voice channel'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command.');
        }

        const connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
            return interaction.reply('I am not in a voice channel.');
        }

        // Clear the queue, reset the player, and destroy the connection
        clearQueue();
        resetPlayer();
        connection.destroy();

        // Reset the connection state
        resetConnection();

        await interaction.reply('Leaving the voice channel.');
    },
};
