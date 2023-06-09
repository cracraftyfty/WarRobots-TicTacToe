const config = require(`../botconfig/config.json`);
module.exports = client => {
   process.on('unhandledRejection', (reason, p) => {
        console.log(`[${config.console_tag}] [antiCrash] :: Unhandled Rejection/Catch`);
        console.log(reason, p);
    });
    process.on("uncaughtException", (err, origin) => {
        console.log(`[${config.console_tag}] [antiCrash] :: Uncaught Exception/Catch`);
        console.log(err, origin);
    }) 
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(`[${config.console_tag}] [antiCrash] :: Uncaught Exception/Catch (MONITOR)`);
        console.log(err, origin);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        console.log(`[${config.console_tag}] [antiCrash] :: Multiple Resolves`);
        console.log(type, promise, reason);
    });
}
