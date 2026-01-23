const { exec } = require('yt-dlp-exec');
const { fs } = require('fs');

async function test() {
    const url = 'https://www.youtube.com/watch?v=ah4VJDHQEFI';
    console.log('Fetching audio stream for:', url);

    try {
        // Utilisation de yt-dlp pour récupérer directement un flux audio mp3
        const audioFile = 'audio.mp3';
        await exec(url, {
            output: audioFile,
            format: 'bestaudio[ext=m4a]/bestaudio',
            quiet: true,
            noWarnings: true
        });

        console.log(`Audio downloaded as ${audioFile}`);
    } catch (err) {
        console.error('Error fetching audio stream:', err);
    }
}

test();
