const { SlashCommandBuilder } = require('discord.js');


// add dispo 
// remove dispo
// display dispo list

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dispo')
        .setDescription('Add / Remove / List - (My [without parameter] / All)')
        .addStringOption(option =>
            option.setName('add')
                .setDescription('Disponibility to add')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('remove')
                .setDescription('Disponibilityt to remove')
                .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('list')
    //         .setDescription('List all disponibility')
    //         .setRequired(false))
    ,
    async execute(interaction) {




        // Respond to the interaction
        await interaction.reply(`I got you ${interaction.member.user.globalName} !`);
    },
};
