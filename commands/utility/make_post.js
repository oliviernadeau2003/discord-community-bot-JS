const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Colors } = require('discord.js');

// Define a reduced dictionary of color names to Discord.js color constants
const discordColors = {
    'default': Colors.Default,
    'white': Colors.White,
    'aqua': Colors.Aqua,
    'green': Colors.Green,
    'blue': Colors.Blue,
    'yellow': Colors.Yellow,
    'purple': Colors.Purple,
    'luminous_vivid_pink': Colors.LuminousVividPink,
    'fuchsia': Colors.Fuchsia,
    'gold': Colors.Gold,
    'orange': Colors.Orange,
    'red': Colors.Red,
    'grey': Colors.Grey,
    'darker_grey': Colors.DarkerGrey,
    'navy': Colors.Navy,
    'dark_aqua': Colors.DarkAqua,
    'dark_green': Colors.DarkGreen,
    'dark_blue': Colors.DarkBlue,
    'dark_purple': Colors.DarkPurple,
    'dark_vivid_pink': Colors.DarkVividPink,
    'dark_gold': Colors.DarkGold,
    'dark_orange': Colors.DarkOrange,
    'dark_red': Colors.DarkRed,
    'light_grey': Colors.LightGrey,
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
                .setRequired(false)
                .addChoices(...Object.keys(discordColors).map(key => ({ name: key.replace(/_/g, ' '), value: key }))))
        .addStringOption(option =>
            option.setName('author')
                .setDescription('Author of the post')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('author_icon_url')
                .setDescription('Author icon URL')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL of the post')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('Thumbnail URL')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('Image URL (direct link to the file)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('Footer text')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer_icon_url')
                .setDescription('Footer icon URL')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('timestamp')
                .setDescription('Include timestamp')
                .setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || 'blue';
        const author = interaction.options.getString('author');
        const authorIconUrl = interaction.options.getString('author_icon_url');
        const url = interaction.options.getString('url');
        const thumbnail = interaction.options.getString('thumbnail');
        const imageURL = interaction.options.getString('image_url');
        const footer = interaction.options.getString('footer');
        const footerIconUrl = interaction.options.getString('footer_icon_url');
        const timestamp = interaction.options.getBoolean('timestamp') || false;

        const colorValue = discordColors[color] || Colors.Blue;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(colorValue);

        if (author) embed.setAuthor({ name: author, iconURL: authorIconUrl || undefined });
        if (url) embed.setURL(url);
        if (thumbnail) embed.setThumbnail(thumbnail);

        // let file;
        if (imageURL) {
            embed.setImage(imageURL);
        }

        if (footer) embed.setFooter({ text: footer, iconURL: footerIconUrl || undefined });
        if (timestamp) embed.setTimestamp();

        const options = { embeds: [embed] };
        await interaction.channel.send(options);
        await interaction.reply({ content: 'Post created!', ephemeral: true });
    },
};
