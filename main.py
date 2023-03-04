import discord
import requests

TOKEN = ''

client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    elif message.content.startswith("getAll"):
        url = "http://172.105.103.136/api/products/getAll/"
        response = requests.get(url)
        args = message.content.split()
        if len(args) > 1:
            url += args[1]
        if response.status_code == 200:
            json_data = response.json()
            await message.reply("```\n" +
                                "URL: " + url + "\n"
                                "Name: " + json_data[0]["name"] + "\n" +
                                "Description: " + json_data[0]["description"] + "\n" +
                                "Image: " + json_data[0]["image"] + "\n" +
                                "Seller: " + json_data[0]["seller"] + "\n" +
                                "Price: " + str(json_data[0]["price"]) + "\n" +
                                "```")
        else:
            await message.reply("error")

client.run(TOKEN)