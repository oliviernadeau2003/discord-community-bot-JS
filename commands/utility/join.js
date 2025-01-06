const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Makes the bot join your current voice channel.'),
    async execute(interaction) {
        // Get the user's voice channel
        const voiceChannel = interaction.member.voice.channel;

        // If the user is not in a voice channel, return a message
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command.');
        }

        // Join the user's voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // Respond to the interaction
        await interaction.reply(`Joined ${interaction.member.user.globalName} in voice channel: ${voiceChannel.name}`);
    },
};
