const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givemebadge')
        .setDescription('Gives information about obtaining the Active Developer badge.'),
    async execute(interaction) {
        // Create an embed using EmbedBuilder
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Active Developer Badge Information')
            .setURL('https://discord.com/developers/active-developer')
            .setDescription(
                "Eligibility for the badge is checked by Discord in intervals. " +
                "At this moment in time, 24 hours is the recommended time to wait before trying.\n\n" +
                "If it's already been 24 hours, you can head to [Discord Developer Portal](https://discord.com/developers/active-developer) " +
                "and fill out the 'form' there.\n\n" +
                "Updates regarding the Active Developer badge can be found in the " +
                "[Discord Developers server](https://discord.gg/discord-developers) in the #active-dev-badge channel."
            )
            .setThumbnail('https://preview.redd.it/say-hello-to-the-new-active-developer-badge-v0-tswry4vw56z91.png?auto=webp&s=40bd51e3e008ed4737a64fbaa1f3e629352848be')
            .setTimestamp()

        // Send the embed
        await interaction.reply({ embeds: [exampleEmbed] });
    },
};
