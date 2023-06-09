const fs = require("fs");
const config = require(`../botconfig/config.json`);
const allevents = [];
module.exports = async (client) => {
    try {
        
        let amount = 0;
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                try {
                    const event = require(`../events/${dir}/${file}`)
                    let eventName = file.split(".")[0];
                    allevents.push(eventName);
                    client.on(eventName, event.bind(null, client));
                    amount++;
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await ["client", "guild"].forEach(e => load_dir(e));
        console.log(`[${config.console_tag}] ${amount} Events Loaded`.brightGreen);
        
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};