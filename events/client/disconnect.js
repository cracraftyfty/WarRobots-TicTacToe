//here the event starts
const config = require(`../../botconfig/config.json`);
module.exports = client => {
    console.log(`[${config.console_tag}] You have been disconnected at ${new Date()}.`.dim)
}