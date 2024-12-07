const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, getVoiceConnection } = require('@discordjs/voice');
// const ytdl = require('ytdl-core'); //? Outdated
const ytdl = require("@distube/ytdl-core");

// Define an array to store queued songs
const queue = [];
// Create a single audio player instance
const player = createAudioPlayer();
// Maintain the connection state
let connection;

function clearQueue() {
    queue.length = 0;
}

function resetPlayer() {
    player.stop();
}

function resetConnection() {
    connection = undefined;
}

function createConnection(channelId, guildId, adapterCreator) {
    connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: adapterCreator,
    });
    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch (error) {
            connection.destroy();
            connection = null;
            clearQueue();
            resetPlayer();
        }
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
        clearQueue();
        resetPlayer();
    });
}

module.exports = {
    queue,
    player,
    connection,
    clearQueue,
    resetPlayer,
    createConnection,
    resetConnection,
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a YouTube video in your current voice channel')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The YouTube URL')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');

        // Validate if the URL is a YouTube link
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
        if (!youtubeRegex.test(url)) {
            return interaction.reply('Invalid YouTube URL. Please provide a valid YouTube video link.');
        }

        // Ensure the user is in a voice channel
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command.');
        }

        // Create the connection if not already created
        if (!connection) {
            createConnection(voiceChannel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator);
        }

        // Download the audio from YouTube
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const resource = createAudioResource(stream);

        // If there is already a song playing or in the queue, add this song to the queue
        if (queue.length > 0 || player.state.status === AudioPlayerStatus.Playing) {
            queue.push({ url, resource });
            return interaction.reply(`Added to queue: ${url}`);
        }

        // Play the song
        player.play(resource);

        // Respond to the interaction
        await interaction.reply(`Playing now: ${url}`);

        // Handle the end of the audio
        player.on(AudioPlayerStatus.Idle, () => {
            // If there are queued songs, play the next one
            if (queue.length > 0) {
                const { resource: nextResource } = queue.shift();
                player.play(nextResource);
            } else {
                // Destroy the connection only if the queue is empty
                if (connection !== undefined) {
                    connection.destroy();
                    connection = undefined; // Reset the connection state                    
                }
            }
        });

        player.on('error', error => {
            console.error('Error:', error);
            interaction.followUp('There was an error playing the audio.');
            connection.destroy();
            connection = null; // Reset the connection state
        });
    },
};
