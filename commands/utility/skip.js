const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { queue, player } = require('./play'); // Import the shared queue and player from play.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing song'),
    async execute(interaction) {
        // Ensure the user is in a voice channel
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command.');
        }

        if (queue.length === 0 && player.state.status !== AudioPlayerStatus.Playing) {
            return interaction.reply('The queue is empty.');
        }

        // Skip the currently playing song by stopping the player
        if (player.state.status === AudioPlayerStatus.Playing) {
            player.stop();
            if (queue.length > 0) {
                const { resource: nextResource } = queue.shift();
                player.play(nextResource);
                interaction.reply('Song skipped.');
            } else {
                interaction.reply('Song skipped. No more songs in the queue.');
            }
        } else {
            interaction.reply('No song is currently playing.');
        }
    },
};
