const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, StringSelectMenuBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const client = new Discord.Client({intents: [35565]});

const tree = new SlashCommandBuilder()
  .setName('menu')
  .setDescription('Menu that integrates with the BASEL API.')
  .setDefaultPermission(true);
const getAll = new SlashCommandBuilder()
  .setName('getall')
  .setDescription('Test command')
  .setDefaultPermission(true);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.forEach((guild) => {
    guild.commands
      .create(tree)
      .then((command) => console.log(`Created command ${command.name}`))
      .catch(console.error);
    guild.commands
      .create(getAll)
      .then((command) => console.log(`Created command ${command.name}`))
      .catch(console.error);
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'getall') {
    const url = 'http://172.105.103.136/api/products/getAll/';
    try {
      const response = await axios.get(url);
      const json_data = response.data;
      let response_str = '```';
      for (let data of json_data) {
        response_str += `
        ID: ${data.id}
        Name: ${data.name}
        Description: ${data.description}
        Image: ${data.image}
        Seller: ${data.seller}
        Price: $${data.price}
        `;
      }
      response_str += '```';
      await interaction.reply({ content: response_str, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error', ephemeral: true });
    }
  }
  if (interaction.commandName === 'menu') {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('http://172.105.103.136/')
      .setURL('http://172.105.103.136/')
      .setAuthor({ name: 'BASEL', iconURL: 'https://cdn.discordapp.com/attachments/1074487980045115393/1081575553724854412/logo-color.png', url: 'http://172.105.103.136/' })
      .setDescription('Menu that integrates with the BASEL API.')
      .setThumbnail('https://cdn.discordapp.com/attachments/1074487980045115393/1081575553724854412/logo-color.png')
      .addFields(
        { name: 'Navigate using the select menu.', value: 'getAll, searchPublic, fromUser' },
      )
      .setTimestamp()
      .setFooter({ text: 'Reduce Reuse Recycle', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'getAll',
							description: 'Gets all items in a catagory',
							value: 'first_option',
						},
						{
							label: 'searchPublic',
							description: 'Gets all items containing a keyword',
							value: 'second_option',
						},
            {
							label: 'fromUser',
							description: 'Gets all items from a user',
							value: 'third_option',
						},
					),
			);
    interaction.reply({ embeds: [exampleEmbed], components: [row], ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  interaction.reply({ content: 'clicked', ephemeral: true });
});

fs.readFile('token.txt', 'utf8', function (err, data) {
  if (err) throw err;
  const token = data.trim();
  client.login(token);
});