const { SlashCommandBuilder } = require('discord.js');
const { queue } = require('./play'); // Importer la queue directement

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current queue'),

    async execute(interaction) {
        if (queue.length === 0) {
            return interaction.reply('The queue is empty.');
        }

        await interaction.deferReply(); // Toujours déférer si traitement potentiellement long

        const queueMessage = queue.map((item, index) => {
            const duration = formatDuration(item.duration);
            return `**${index + 1}.** ${item.title} — ${duration}`;
        });

        await interaction.editReply(`🎶 **Current queue:**\n${queueMessage.join('\n')}`);
    },
};

// Helper pour convertir la durée en hh:mm:ss ou mm:ss
function formatDuration(durationInSeconds) {
    if (!durationInSeconds || isNaN(durationInSeconds)) return 'Unknown';

    const h = Math.floor(durationInSeconds / 3600);
    const m = Math.floor((durationInSeconds % 3600) / 60);
    const s = durationInSeconds % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    return `${m}:${s.toString().padStart(2, '0')}`;
}
