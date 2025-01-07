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

        // Days of week
        .addStringOption(option =>
            option.setName('Lundi')
                .setDescription('Disponibility on Monday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Mardi')
                .setDescription('Disponibility on Tuesday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Mercredi')
                .setDescription('Disponibility on Wednesday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Jeudi')
                .setDescription('Disponibility on Thursday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Vendredi')
                .setDescription('Disponibility on Friday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Samedi')
                .setDescription('Disponibility on Saturday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('Dimanche')
                .setDescription('Disponibility on Sunday')
                .setRequired(true))
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
