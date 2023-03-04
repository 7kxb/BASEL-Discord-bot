import discord

TOKEN = 'MTA4MTM4NzU3MDIyMDUwMzE4MA.GeZGyo.L0I_8YFyOLgeaqzn6tM_nEv3gC-yoIrMN9bh2U'

client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    elif "ping" in message.content:
        await message.channel.send("pong")

client.run(TOKEN)