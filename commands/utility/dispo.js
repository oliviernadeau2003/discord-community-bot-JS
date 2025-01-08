const { SlashCommandBuilder } = require('discord.js');


// add dispo 
// remove dispo
// display dispo list

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dispo')
        .setDescription('Add / Remove / List - (My [without parameter] / All)')
        // Required

        .setName('modify')
        .setDescription('Add or remove a specified user with 5 other parameters.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action to perform: add or remove')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                ))

        // Days of week
        .addStringOption(option =>
            option.setName('lundi')
                .setDescription('Disponibility on Monday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mardi')
                .setDescription('Disponibility on Tuesday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mercredi')
                .setDescription('Disponibility on Wednesday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('jeudi')
                .setDescription('Disponibility on Thursday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('vendredi')
                .setDescription('Disponibility on Friday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('samedi')
                .setDescription('Disponibility on Saturday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('dimanche')
                .setDescription('Disponibility on Sunday')
                .setRequired(true))

    // Not require
    // .addStringOption(option =>
    //     option.setName('add')
    //         .setDescription('Disponibility to add')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('remove')
    //         .setDescription('Disponibilityt to remove')
    //         .setRequired(false))
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
