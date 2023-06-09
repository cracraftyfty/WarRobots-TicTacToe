const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
let emote = settings.emotes
const Discord = require('discord.js')
const fs = require('fs');
module.exports = {
    name: "tictactoe",
    description: "Play a Tic Tac Toe game",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: ["344915148487786498"],
    options: [
        {"User": { name: "player", description: "Mention the player you want to play tic tac toe with", required: true }}
    ],
    run: async (client, interaction) => {
        const {guild, member} = interaction;

        let user = interaction.options.getUser("player")
        
        //Read tictactoe File
        let TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))

        if(TTT_FILE.status) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(':x: A game is already in progress, please wait')
            ],
            ephemeral: true
        })

        if(member.id === user.id) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(':x: You cannot play with yourself, get some friends!')
            ],
            ephemeral: true
        })

        TTT_FILE.status = true
        TTT_FILE.players = [member.id, user.id]
        fs.writeFileSync(`./database/tictactoe.json`, JSON.stringify(TTT_FILE, null, 4))

        interaction.reply({ 
            embeds: [
                new MessageEmbed()
                .setColor('YELLOW')
                .setDescription(`A match has started between ${member} and ${user}`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('ttt-0,0')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('ttt-0,1')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('ttt-0,2')
                        .setLabel('-')
                        .setStyle('SECONDARY')
                ),
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('ttt-1,0')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('ttt-1,1')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('ttt-1,2')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                ),
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('ttt-2,0')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('ttt-2,1')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('ttt-2,2')
                        .setLabel('-')
                        .setStyle('SECONDARY'),
                )
            ],
            ephemeral: false
        })
        
        
    }
}