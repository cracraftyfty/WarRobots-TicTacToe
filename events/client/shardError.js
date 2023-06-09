//here the event starts
const config = require(`../../botconfig/config.json`);
module.exports = (client, error, id) => {
    console.log(`[${config.console_tag}] || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Shard #${id} Errored || <==> ||`)
}