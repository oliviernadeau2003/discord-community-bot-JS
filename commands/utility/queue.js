const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const { queue } = require('./play'); // Import the queue variable from play.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current queue'),
    async execute(interaction) {
        // Check if there are items in the queue
        if (queue.length === 0) {
            return interaction.reply('The queue is empty.');
        }

        // Generate a message with the queued song titles and time durations
        const queueMessage = await Promise.all(queue.map(async (item, index) => {
            // Fetch the duration information from the audio stream using ytdl-core
            const info = await ytdl.getBasicInfo(item.url);
            const duration = await calculateDuration(info);
            return `${index + 1}. ${info.videoDetails.title} - ${duration}`;
        }));

        // Reply with the queue message
        await interaction.reply(`Current queue:\n${queueMessage.join('\n')}`);
    },
};

// Function to calculate the duration of the audio resource
async function calculateDuration(info) {
    try {
        // Parse the duration from the fetched information
        const durationInSeconds = parseInt(info.videoDetails.lengthSeconds);

        // Convert the duration to a human-readable format (hh:mm:ss)
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        return `${hours ? hours.toString().padStart(2, '0') + 'm' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0' + 's')}`;
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 'Unknown';
    }
}
