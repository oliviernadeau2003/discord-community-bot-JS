const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { exec } = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

// ------------------------
// Variables globales
// ------------------------
const queue = [];
const player = createAudioPlayer();
let connection;

// ------------------------
// Gestion de la connexion
// ------------------------
function createConnection(channelId, guildId, adapterCreator) {
    connection = joinVoiceChannel({ channelId, guildId, adapterCreator });
    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5000),
            ]);
        } catch {
            connection.destroy();
            connection = undefined;
            clearQueue();
            resetPlayer();
        }
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
        clearQueue();
        resetPlayer();
    });
}

// ------------------------
// Gestion du player
// ------------------------
function clearQueue() { queue.length = 0; }
function resetPlayer() { player.stop(); }
function resetConnection() { connection = undefined; }

// ------------------------
// Télécharge et crée la ressource audio
// ------------------------
async function getAudioResource(url) {
    const tempFile = path.join(__dirname, 'temp_audio.m4a');

    // Télécharger l'audio via yt-dlp
    await exec(url, {
        output: tempFile,
        format: 'bestaudio[ext=m4a]/bestaudio',
        quiet: true,
        noWarnings: true
    });

    if (!fs.existsSync(tempFile)) throw new Error('Failed to download audio');
    return createAudioResource(fs.createReadStream(tempFile));
}

// ------------------------
// Commande Discord
// ------------------------
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
                .setRequired(true)
        ),

    // ... imports et variables inchangés

    async execute(interaction) {
        const url = interaction.options.getString('url');

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel)
            return interaction.reply('You need to be in a voice channel to use this command.');

        // Déférer la réponse pour gagner du temps
        await interaction.deferReply();

        if (!connection) {
            createConnection(voiceChannel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator);
        }

        let resource, info;
        try {
            info = await exec(url, { dumpSingleJson: true, quiet: true });
            resource = await getAudioResource(url);
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Could not retrieve audio stream.');
        }

        const title = info.title || 'Unknown title';
        const duration = info.duration || 0;

        if (queue.length > 0 || player.state.status === AudioPlayerStatus.Playing) {
            queue.push({ url, resource, title, duration });
            return interaction.editReply(`➕ Added to queue: ${title}`);
        }

        queue.push({ url, resource, title, duration });
        player.play(resource);
        await interaction.editReply(`🎶 Now playing: ${title}`);

        player.on(AudioPlayerStatus.Idle, () => {
            if (queue.length > 0) {
                const next = queue.shift();
                player.play(next.resource);
            } else if (connection) {
                connection.destroy();
                connection = undefined;
            }
        });

        player.on('error', error => {
            console.error('Error:', error);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp('❌ Audio error.');
            }
            if (connection) {
                connection.destroy();
                connection = undefined;
            }
        });
    },
};
