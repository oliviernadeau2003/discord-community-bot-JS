const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

// Define a dictionary of color names to Discord.js color constants
const discordColors = {
    'blue': Colors.Blue,
    'red': Colors.Red,
    'green': Colors.Green,
    // Add more colors as needed
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('makepost')
        .setDescription('Create a post and notify everyone subscribed through a role to the subject')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the post')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description of the post')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color of the embed')
                .setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        let color = interaction.options.getString('color') || 'blue';

        color = color.toLowerCase();
        const colorValue = discordColors[color] || Colors.Blue;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(colorValue);

        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Post created!', ephemeral: true });
    }
};
