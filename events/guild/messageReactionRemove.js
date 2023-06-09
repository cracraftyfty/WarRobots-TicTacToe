const config = require("../../botconfig/config.json");
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js");
//here the event starts
module.exports = async (client, reaction, user) => {
   //logs when a reaction appears
   if (reaction.message.partial) await reaction.message.fetch();
   if (reaction.partial) await reaction.fetch();
   if (user.bot) return;
   if (!reaction.message.guild) return;
   //REST OF THE CODE HERE
}