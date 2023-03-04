import discord
from discord import app_commands
from discord.ext import commands
import requests

file = open('token.txt', 'r')
TOKEN = file.read()
file.close()

intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

@tree.command(name = "menu", description = "Menu that integrates with the BASEL API.", guild=discord.Object(id=1081307027697041548))
async def menu(interaction):
    embed=discord.Embed(title="http://172.105.103.136/", url="http://172.105.103.136/", description="Menu that integrates with the BASEL API.", color=0x33d17a)
    embed.set_author(name="BASEL", icon_url="https://cdn.discordapp.com/attachments/1074487980045115393/1081575553724854412/logo-color.png")
    embed.set_thumbnail(url="https://cdn.discordapp.com/attachments/1074487980045115393/1081575553724854412/logo-color.png")
    embed.add_field(name="Navigate using the buttons", value="getAll, searchPublic, fromUser")
    await interaction.response.send_message(embed=embed, ephemeral=True)

@tree.command(name = "getall", description = "test command", guild=discord.Object(id=1081307027697041548))
async def getAll(interaction):
    url = "http://172.105.103.136/api/products/getAll/"
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        response = "```\nURL: " + url + "\n"
        for data in json_data:
            response += (
                            "\nID: " + str(data["id"]) + "\n" +
                            "Name: " + data["name"] + "\n" +
                            "Description: " + data["description"] + "\n" +
                            "Image: " + data["image"] + "\n" +
                            "Seller: " + data["seller"] + "\n" +
                            "Price: $" + str(data["price"]) + "\n"
                        )
        response += "```"
        await interaction.response.send_message(response, ephemeral=True)
    else:
        await interaction.response.send_message("error", ephemeral=True)

@client.event
async def on_ready():
    await tree.sync(guild=discord.Object(id=1081307027697041548))
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

client.run(TOKEN)