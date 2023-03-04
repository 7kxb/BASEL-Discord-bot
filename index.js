const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const client = new Discord.Client({intents: [35565]});

const tree = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Discord Bot that integrates with the BASEL API.')
  .setDefaultPermission(true);
const ga = new SlashCommandBuilder()
  .setName('getall')
  .setDescription('Gets all items in a catagory.')
  .setDefaultPermission(true);
const sk = new SlashCommandBuilder()
  .setName('searchkeyword')
  .setDescription('Gets all items containing a keyword.')
  .setDefaultPermission(true);
const fu = new SlashCommandBuilder()
  .setName('fromuser')
  .setDescription('Gets all items from a user.')
  .setDefaultPermission(true);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.forEach((guild) => {
    guild.commands
      .create(tree)
      .then((command) => console.log(`Created command ${command.name}`))
      .catch(console.error);
    guild.commands
      .create(ga)
      .then((command) => console.log(`Created command ${command.name}`))
      .catch(console.error);
    guild.commands
      .create(sk)
      .then((command) => console.log(`Created command ${command.name}`))
      .catch(console.error);
    guild.commands
      .create(fu)
      .then((command) => console.log(`Created command ${command.name}`))
      .catch(console.error);
  });
});

async function info(interaction) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('http://172.105.103.136/')
    .setURL('http://172.105.103.136/')
    .setAuthor({ name: 'BASEL', iconURL: 'https://cdn.discordapp.com/attachments/1074487980045115393/1081575553724854412/logo-color.png', url: 'http://172.105.103.136/' })
    .setDescription('Discord Bot that integrates with the BASEL API.')
    .setThumbnail('https://cdn.discordapp.com/attachments/1074487980045115393/1081575553724854412/logo-color.png')
    .addFields(
      { name: 'getall', value: 'Gets all items in a catagory.' },
    )
    .addFields(
      { name: 'searchkeyword', value: 'Gets all items containing a keyword.' },
    )
    .addFields(
      { name: 'fromuser', value: 'Gets all items from a user.' },
    )
    .setTimestamp()
    .setFooter({ text: 'Reduce Reuse Recycle', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
  await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
}

async function getAll(interaction, num) {
  const url = 'http://172.105.103.136/api/products/getAll/'+num;
  console.log(url);
  const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Help')
          .setStyle(ButtonStyle.Primary),
      );
  try {
    let response_str = '```';
    if (num != "-1") {
      const response = await axios.get(url);
      const json_data = response.data;
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
    }
    const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Nothing selected')
        .addOptions(
          {
            label: 'CPU',
            description: 'Central Processing Unit',
            value: 'first_option',
          },
          {
            label: 'GPU',
            description: 'Graphics Processing Unit',
            value: 'second_option',
          },
          {
            label: 'RAM',
            description: 'Random Access Memory',
            value: 'third_option',
          },
          {
            label: 'Miscellaneous',
            description: 'Miscellaneous',
            value: 'fourth_option',
          },
          {
            label: 'Motherboard',
            description: 'Motherboard',
            value: 'fifth_option',
          },
          {
            label: 'Computer Case',
            description: 'Computer Case',
            value: 'sixth_option',
          },
          {
            label: 'HDD',
            description: 'Hard Disk Drive',
            value: 'seventh_option',
          },
          {
            label: 'SSD',
            description: 'Solid State Drive',
            value: 'eighth_option',
          },
          {
            label: 'Mouse',
            description: 'Mouse',
            value: 'ninth_option',
          },
          {
            label: 'Keyboard',
            description: 'Keyboard',
            value: 'tenth_option',
          },
          {
            label: 'Monitors',
            description: 'Monitors',
            value: 'eleventh_option',
          },
          {
            label: 'Cooler',
            description: 'Cooling System',
            value: 'twelfth_option',
          },
          {
            label: 'Case Fan',
            description: 'Case Fan',
            value: 'thirteenth_option',
          },
          {
            label: 'Phone',
            description: 'Mobile Devices',
            value: 'fourteenth_option',
          },
        ),
    );
    if (num != "-1") {interaction.reply({ content: response_str, components: [row], ephemeral: true });}
    else {interaction.reply({ content: "Pick an item catagory", components: [row], ephemeral: true });}
  } catch (error) {
    console.error(error);
    interaction.reply({ content: 'Error', components: [row], ephemeral: true });
  }
}

async function searchKeyword(interaction, keyword) {
  const url = 'http://172.105.103.136/api/products/search '+keyword;
  console.log(url);
  const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Help')
          .setStyle(ButtonStyle.Primary),
      );
  try {
    let response_str = '```';
    const response = await axios.get(url);
    const json_data = response.data;
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
    interaction.reply({ content: response_str, ephemeral: true });
  } catch (error) {
    console.error(error);
    interaction.reply({ content: 'Error', components: [row], ephemeral: true });
  }
}

async function fromUser(interaction, user) {
  const url = 'http://172.105.103.136/api/products/getAllPublicFromUser '+user;
  console.log(url);
  const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Help')
          .setStyle(ButtonStyle.Primary),
      );
  try {
    let response_str = '```';
    const response = await axios.get(url);
    const json_data = response.data;
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
    interaction.reply({ content: response_str, ephemeral: true });
  } catch (error) {
    console.error(error);
    interaction.reply({ content: 'Error', components: [row], ephemeral: true });
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'help') {
    info(interaction);
  }
  if (interaction.commandName === 'getall') {
    getAll(interaction, "-1");
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  info(interaction);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;
  const selected = interaction.values[0];
  console.log(selected);
	if (selected === 'first_option') {
		getAll(interaction, "0");
	}
  if (selected === 'second_option') {
		getAll(interaction, "1");
	}
  if (selected === 'third_option') {
		getAll(interaction, "2");
	}
  if (selected === 'fourth_option') {
		getAll(interaction, "3");
	}
  if (selected === 'fifth_option') {
		getAll(interaction, "4");
	}
  if (selected === 'sixth_option') {
		getAll(interaction, "5");
	}
  if (selected === 'seventh_option') {
		getAll(interaction, "6");
	}
  if (selected === 'eighth_option') {
		getAll(interaction, "7");
	}
  if (selected === 'ninth_option') {
		getAll(interaction, "8");
	}
  if (selected === 'tenth_option') {
		getAll(interaction, "9");
	}
  if (selected === 'eleventh_option') {
		getAll(interaction, "10");
	}
  if (selected === 'twelfth_option') {
		getAll(interaction, "11");
	}
  if (selected === 'thirteenth_option') {
		getAll(interaction, "12");
	}
  if (selected === 'fourteenth_option') {
		getAll(interaction, "13");
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (interaction.commandName === 'searchkeyword') {
		const modal = new ModalBuilder()
			.setCustomId('prompt')
			.setTitle('Prompt');
		const keyword = new TextInputBuilder()
			.setCustomId('keyword')
			.setLabel("Search keyword:")
			.setStyle(TextInputStyle.Short);
		const firstActionRow = new ActionRowBuilder().addComponents(keyword);
		modal.addComponents(firstActionRow);
		await interaction.showModal(modal);
	}
  if (interaction.commandName === 'fromuser') {
		const modal = new ModalBuilder()
			.setCustomId('prompt2')
			.setTitle('Prompt');
		const user = new TextInputBuilder()
			.setCustomId('user')
			.setLabel("User:")
			.setStyle(TextInputStyle.Short);
		const firstActionRow = new ActionRowBuilder().addComponents(user);
		modal.addComponents(firstActionRow);
		await interaction.showModal(modal);
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'prompt') {
    const keyword = interaction.fields.getTextInputValue('keyword');
		searchKeyword(interaction, keyword);
	}
  if (interaction.customId === 'prompt2') {
    const user = interaction.fields.getTextInputValue('user');
		searchKeyword(interaction, user);
	}
});

fs.readFile('token.txt', 'utf8', function (err, data) {
  if (err) throw err;
  const token = data.trim();
  client.login(token);
});