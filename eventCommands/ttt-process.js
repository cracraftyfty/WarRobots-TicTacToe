const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const fs = require('fs');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('ttt-')) return;    
    //return console.log(`Custom ID: ${customId}`)
    let player = member.id
    let BOARD_ROW = customId.split('-')[1].split(',')[0]
    let BOARD_COLLUMN = customId.split('-')[1].split(',')[1]
    let TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
    let BOARD = TTT_FILE.board
    let BOARD_SIZE = TTT_FILE.game.size
    
    if(!TTT_FILE.players.includes(member.id)) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`:x: You are not a part of the game`)
        ],
        ephemeral: true
    })

    if(member.id === TTT_FILE.prvs_user) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`:x: Please wait for your opponents turn`)
        ],
        ephemeral: true
    })
    let turn = TTT_FILE.game.turn

    makeMove(BOARD_ROW, BOARD_COLLUMN)


    async function makeMove(row, col) {
        if (!BOARD[row][col]) {
            TTT_FILE.game.turn++
            BOARD[row][col] = player;
            interaction.message.components[BOARD_ROW].components[BOARD_COLLUMN].setDisabled(true)
            if(member.id === TTT_FILE.players[0]){
                interaction.message.components[BOARD_ROW].components[BOARD_COLLUMN].setStyle('SUCCESS')
                interaction.message.components[BOARD_ROW].components[BOARD_COLLUMN].setLabel('O')
            }else{
                interaction.message.components[BOARD_ROW].components[BOARD_COLLUMN].setStyle('DANGER')
                interaction.message.components[BOARD_ROW].components[BOARD_COLLUMN].setLabel('X')
            }
            interaction.update({
                components: interaction.message.components
            })
            TTT_FILE.prvs_user = member.id
            fs.writeFileSync(`./database/tictactoe.json`, JSON.stringify(TTT_FILE, null, 4))
            TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
            
            
            if(checkIfSizeIncrease()){ 
                    //Check if new row front or back [ROW]
                    TTT_FILE.game.size++

                    if(randomIncreasePosition()){
                        interaction.message.components.unshift(
                            new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId(`ttt-${TTT_FILE.game.size},0`)
                                    .setLabel('-')
                                    .setStyle('SECONDARY'),
                                new Discord.MessageButton()
                                    .setCustomId(`ttt-${TTT_FILE.game.size},1`)
                                    .setLabel('-')
                                    .setStyle('SECONDARY'),
                                new Discord.MessageButton()
                                    .setCustomId(`ttt-${TTT_FILE.game.size},2`)
                                    .setLabel('-')
                                    .setStyle('SECONDARY')
                            )
                        )

                        TTT_FILE.board.unshift([false, false, false])
    
                    }else{
                        interaction.message.components.push(
                            new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId(`ttt-${TTT_FILE.game.size},0`)
                                    .setLabel('-')
                                    .setStyle('SECONDARY'),
                                new Discord.MessageButton()
                                    .setCustomId(`ttt-${TTT_FILE.game.size},1`)
                                    .setLabel('-')
                                    .setStyle('SECONDARY'),
                                new Discord.MessageButton()
                                    .setCustomId(`ttt-${TTT_FILE.game.size},2`)
                                    .setLabel('-')
                                    .setStyle('SECONDARY')
                            )
                        )

                        TTT_FILE.board.push([false, false, false])

                    }


                    //Check if new row front or back [COL]
                    if(randomIncreasePosition()){
                    
                        for(i=0;i<TTT_FILE.game.size; i++){
                            interaction.message.components[i].components.unshift(
                                new Discord.MessageButton()
                                .setCustomId(`ttt-${i},${TTT_FILE.game.size}`)
                                .setLabel('-')
                                .setStyle('SECONDARY')
                            )
                            
                            TTT_FILE.board[i].unshift(false)
                        }
                    }else{
                        for(i=0;i<TTT_FILE.game.size; i++){
                            interaction.message.components[i].components.unshift(
                                new Discord.MessageButton()
                                .setCustomId(`ttt-${i},${TTT_FILE.game.size}`)
                                .setLabel('-')
                                .setStyle('SECONDARY')
                            )

                            TTT_FILE.board[i].push(false)
                        }
                    }
                    fs.writeFileSync(`./database/tictactoe.json`, JSON.stringify(TTT_FILE, null, 4))
                    TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))



                    //Fix the Interaction

                    for(i=0;i<TTT_FILE.board.length;i++){
                        for(j=0;j<TTT_FILE.board[i].length;j++){
                            console.log(interaction.message.components[i].components[j].customId, i, j)
                            interaction.message.components[i].components[j].customId = `ttt-${i},${j}`
                        }
                    }
                    console.log(interaction.message.components.length, interaction.message.components[0].components.length)

                    await interaction.message.edit({
                        components: interaction.message.components
                    })
            }


            if (checkWin(player, BOARD_SIZE)) {
                TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
                for(i=0;i<TTT_FILE.game.size;i++){
                    for(j=0;j<TTT_FILE.game.size;j++){
                        if(!interaction.message.components[i].components[j].disabled) interaction.message.components[i].components[j].setDisabled(true)
                    }
                }

                interaction.message.edit({
                    embeds: [
                        new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`✅ Match won by <@${player}>`)
                    ],
                    components: interaction.message.components
                })
                resetGame()


            } else if (checkTie(BOARD_SIZE)) {
                //Disable other buttons
                TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
                interaction.message.edit({
                    embeds: [
                        new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`The match ended up in a Tie`)
                    ]
                })
                resetGame()
            } 
        }
    }

    //Reset the Game
    function resetGame(){
        TTT_FILE.status = false
        TTT_FILE.prvs_user = ''
        TTT_FILE.players = []
        TTT_FILE.board = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ]
        TTT_FILE.game.size = 3
        TTT_FILE.game.turn = 0
        fs.writeFileSync(`./database/tictactoe.json`, JSON.stringify(TTT_FILE, null, 4))
    }

    //Check if anyone won
    function checkWin(mark, size) {
        TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
        switch(size){
            case 3:
                // Check for any rows that have the same mark
                for (let row = 0; row < 3; row++) {
                    if (BOARD[row][0] === mark && BOARD[row][0] === BOARD[row][1] && BOARD[row][1] === BOARD[row][2]) {
                        return true;
                    }
                }
            
                // Check for any columns that have the same mark
                for (let col = 0; col < 3; col++) {
                    if (BOARD[0][col] === mark && BOARD[0][col] === BOARD[1][col] && BOARD[1][col] === BOARD[2][col]) {
                        return true;
                    }
                }
            
                // Check for a diagonal from the top left to the bottom right
                if (BOARD[0][0] === mark && BOARD[0][0] === BOARD[1][1] && BOARD[1][1] === BOARD[2][2]) {
                    return true;
                }
            
                // Check for a diagonal from the top right to the bottom left
                if (BOARD[0][2] === mark && BOARD[0][2] === BOARD[1][1] && BOARD[1][1] === BOARD[2][0]) {
                    return true;
                }
                break;
            case 4: 
                // Check for any rows that have the same mark
                for (let row = 0; row < 4; row++) {
                    if (BOARD[row][0] === mark && BOARD[row][0] === BOARD[row][1] && BOARD[row][1] === BOARD[row][2] && BOARD[row][2] === BOARD[row][3]) {
                        return true;
                    }
                }
                // Check for any columns that have the same mark
                for (let col = 0; col < 4; col++) {
                    if (BOARD[0][col] === mark && BOARD[0][col] === BOARD[1][col] && BOARD[1][col] === BOARD[2][col] && BOARD[2][col] === BOARD[3][col]) {
                        return true;
                    }
                }
            
                // Check for a diagonal from the top left to the bottom right
                if (BOARD[0][0] === mark && BOARD[0][0] === BOARD[1][1] && BOARD[1][1] === BOARD[2][2] && BOARD[2][2] === BOARD[3][3]) {
                    return true;
                }
            
                // Check for a diagonal from the top right to the bottom left
                if (BOARD[0][3] === mark && BOARD[0][3] === BOARD[1][2] && BOARD[1][2] === BOARD[2][1] && BOARD[2][1] === BOARD[3][0]) {
                    return true;
                }
                break;
            case 5:
                // Check for any rows that have the same mark
                for (let row = 0; row < 5; row++) {
                    if (BOARD[row][0] === mark && BOARD[row][0] === BOARD[row][1] && BOARD[row][1] === BOARD[row][2]) {
                        return true;
                    }
                }
            
                // Check for any columns that have the same mark
                for (let col = 0; col < 5; col++) {
                    if (BOARD[0][col] === mark && BOARD[0][col] === BOARD[1][col] && BOARD[1][col] === BOARD[2][col]) {
                        return true;
                    }
                }
            
                // Check for a diagonal from the top left to the bottom right
                if (BOARD[0][0] === mark && BOARD[0][0] === BOARD[1][1] && BOARD[1][1] === BOARD[2][2]) {
                    return true;
                }
            
                // Check for a diagonal from the top right to the bottom left
                if (BOARD[0][2] === mark && BOARD[0][2] === BOARD[1][1] && BOARD[1][1] === BOARD[2][0]) {
                    return true;
                }
                break;
        }
    
        // If we haven't found a winning combination, return false
        return false;
    }

    //Check if there is a tie
    function checkTie(size) {
        TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (!BOARD[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    //Check if board size need to be increased
    function checkIfSizeIncrease(){
        TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
        if(TTT_FILE.game.size === 5) return false
        let randomNumber = randomIntFromInterval(1, 100)
        let chance = turn*7

        if(randomNumber < chance) return true
        else return false
    }

    //get random number
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function randomIncreasePosition(){
        TTT_FILE = JSON.parse(fs.readFileSync(`./database/tictactoe.json`))
        let status = randomIntFromInterval(0,1)
        if(status === 1) return true
        else return false
    }


}




// ID_FORMAT            
/* [
    00, 01, 02, 03, 04
    10, 11, 12, 13, 14
    20, 21, 22, 23, 24
    30, 31, 32, 33, 34
    40, 41, 42, 43, 44
] */

                