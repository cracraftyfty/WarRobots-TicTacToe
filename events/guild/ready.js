//Import Modules
const config = require(`../../botconfig/config.json`);
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const Discord = require('discord.js')
const fs = require('fs')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals'); // Define the discord-modals package!
const { Formatters } = require('discord.js');
const botsettings = require(`../../botconfig/settings.json`);
const nwc = require('../../functions/nwc.js')
const cap = require('../../functions/cap.js')
const intcheck = require('../../functions/intcheck.js')
const unix = require('unix-timestamp')
const settings = require('../../database/settings.json')
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const { time } = require("console");
const { type } = require("os");
var CronJob = require('cron').CronJob;
module.exports = async (client) => {
    const allevents = [];
    const event_files = fs.readdirSync(`./eventCommands/`).filter((file) => file.endsWith(".js"));
    for (const file of event_files) {
        try {
            const event = require(`../../eventCommands/${file}`)
            let eventName = file.split(".")[0];
            allevents.push(eventName);
            client.on('interactionCreate', event.bind(null, client));
        } catch (e) {
            console.log(e)
        }
    }
}