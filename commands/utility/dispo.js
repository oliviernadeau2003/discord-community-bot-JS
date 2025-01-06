const { SlashCommandBuilder } = require('discord.js');


// add dispo 
// remove dispo
// display dispo list

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dispo')
        .setDescription('Add / Remove / List - (My [without parameter] / All)'),
    async execute(interaction) {



        // Respond to the interaction
        await interaction.reply(`I got you ${interaction.member.user.globalName} !`);
    },
};
