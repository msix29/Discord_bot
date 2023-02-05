const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { TOKEN, APP_ID } = require('./config.json');
const { Sequelize } = require('sequelize');
const fs = require("node:fs");
const path = require("node:path");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/database.sqlite',
    logging: console.log
});

const models = fs.readdirSync('models').filter(file => file.endsWith('.js'));

for (let model of models) {
    try {
        const file = require(`./models/${model}`);
        file.import(sequelize);
    } catch (err) {
        console.error(err);
    }
};

sequelize.sync();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

client.sequelize = sequelize;

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && file !== "functions.js");

client.commands = new Collection();

for (let commandFile of commandFiles) {
    const command = require(`./commands/${commandFile}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
};

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    rest.put(Routes.applicationCommands(APP_ID), { body: commands })
        .then(() => console.log(`Successfully reloaded ${commands.length} application (/) commands.`))
        .catch(console.error);
} catch (error) {
    console.error(error);
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(client, interaction, interaction.options);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);