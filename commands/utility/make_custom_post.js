const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { MessageFlags } = require('discord-api-types/v10');

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
        .setName('makecustompost')
        .setDescription('Create a post and notify everyone subscribed through a role to the subject')
    // .addStringOption(option =>
    //     option.setName('title')
    //         .setDescription('Title of the post')
    //         .setRequired(true))
    // .addStringOption(option =>
    //     option.setName('description')
    //         .setDescription('Description of the post')
    //         .setRequired(true))
    // .addStringOption(option =>
    //     option.setName('color')
    //         .setDescription('Color of the embed')
    //         .setRequired(false)
    //         .addChoices(...Object.keys(discordColors).map(key => ({ name: key.replace(/_/g, ' '), value: key }))))
    // .addStringOption(option =>
    //     option.setName('author')
    //         .setDescription('Author of the post')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('author_icon_url')
    //         .setDescription('Author icon URL')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('url')
    //         .setDescription('URL of the post')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('thumbnail')
    //         .setDescription('Thumbnail URL')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('image_url')
    //         .setDescription('Image URL (direct link to the file)')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('footer')
    //         .setDescription('Footer text')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('footer_icon_url')
    //         .setDescription('Footer icon URL')
    //         .setRequired(false))
    // .addBooleanOption(option =>
    //     option.setName('timestamp')
    //         .setDescription('Include timestamp')
    //         .setRequired(false))
    ,

    async execute(interaction) {
        const title = `🎭🕵Soirée Imposteur !🕵️🎭`;
        const description = `Hey tout le monde ! 👀  

        Préparez-vous à une soirée remplie de bluff, de stratégies et de faux-semblants ! Nous organisons une **Soirée Imposteur** où nous allons jouer à plusieurs jeux où le mensonge et la déduction sont la clé de la victoire. 
        
        Au programme :  

        🎮 **Dale & Dawson** – Qui sera l'employé du mois ?  
        
        🔒 **Lockdown Protocol** – Parviendras-tu à t’échapper… ou trahir tes coéquipiers?  
        
        🚀 **Among Us** – Sabotage, mensonges et votes injustes au rendez-vous !  

        ❓ Et d’autres jeux à déterminer ensemble !  


        📅 **Date :** [À compléter]  
        🕘 **Heure :** [À compléter]  
        📍 **Lieu :** Ici même, sur ce serveur !  

        Viens prouver que tu es le maître de la manipulation... ou juste te faire trahir par tes amis ! 😈  

        Réagis avec ✅ si tu es partant(e) ! À bientôt dans l’ombre... 😏`;

        const colorValue = Colors.Gold;
        const author = `MrSkyzZ`;
        const authorIconUrl = `https://cdn.discordapp.com/avatars/295549405056991232/8ac0a93269c0d2740aac039e99a3c87d.webp?size=40`;
        const url = interaction.options.getString('url');
        const thumbnail = `https://cdn.discordapp.com/app-icons/1104549695268851773/c8eabe38702f0359b757b8667a58046a.png?size=256`;
        const imageURL = `https://i.ytimg.com/vi/uTZeMJ4emh8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAbEKli9m_WFUBreIXrr95TO6TS2Q`;
        const footer = `Mr.SkyzZ`;
        const footerIconUrl = interaction.options.getString('footer_icon_url');
        const timestamp = true;


        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(colorValue);

        if (author) embed.setAuthor({ name: author, iconURL: authorIconUrl || undefined });
        if (url) embed.setURL(url);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (imageURL) embed.setImage(imageURL);
        if (footer) embed.setFooter({ text: footer, iconURL: footerIconUrl || undefined });
        if (timestamp) embed.setTimestamp();

        const options = { embeds: [embed] };
        await interaction.channel.send(options);
        await interaction.reply({ content: 'Post created!', flags: MessageFlags.Ephemeral });
    },
};
