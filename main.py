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
        args = message.content.split()
        if len(args) > 1:
            url += args[1]
            print(args[1])
            print(url)
        response = requests.get(url)
        if response.status_code == 200:
            json_data = response.json()
            for i in range(len(json_data[0])):
                await message.reply("``\n" +
                                    "URL: " + url + "\n" +
                                    "ID: " + str(json_data[0][i]["id"]) + "\n" +
                                    "Name: " + json_data[0][i]["name"] + "\n" +
                                    "Description: " + json_data[0][i]["description"] + "\n" +
                                    "Image: " + json_data[0][i]["image"] + "\n" +
                                    "Seller: " + json_data[0][i]["seller"] + "\n" +
                                    "Price: $" + str(json_data[0][i]["price"]) + "\n" +
                                    "``")
                await message.reply(json_data)
        else:
            await message.reply("error")

client.run(TOKEN)