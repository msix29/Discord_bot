const { REST, Routes } = require('discord.js');
const { TOKEN, APP_ID } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(TOKEN);
rest.put(Routes.applicationCommands(APP_ID), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);