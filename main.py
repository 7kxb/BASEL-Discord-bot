import discord
import requests

file = open('token.txt', 'r')
TOKEN = file.read()
file.close()

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
            await message.reply(response)
        else:
            await message.reply("error")

client.run(TOKEN)