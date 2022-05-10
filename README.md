<p align="center"><a href="https://nodei.co/npm/discordeno.js/"><img src="https://nodei.co/npm/discordeno.js.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discordeno.js"> <img src="https://img.shields.io/npm/dm/discordeno.js?label=downloads"> <img src="https://img.shields.io/npm/l/discordeno.js"> <img src="https://img.shields.io/github/repo-size/meister03/discordeno.js">  <a href="https://discord.gg/YTdNBHh"><img src="https://discordapp.com/api/guilds/697129454761410600/widget.png" alt="Discord server"/></a></p>

# Discordeno.js

Discordeno.js is a wrapper around a very scalable library named [Discordeno](https://github.com/discordeno/discordeno), which brings up a djs-like interface but also includes the core Features (Cross Ratelimit, Zero Downtime Restart, Resharding...).

### __Why should I change?__
**Djs was always meant for beginners**. They way how it is built, it's not very scalable. Moreover it is bloated up with a lot of nested classes and references.

It is very noticeable that there are **many breaking changes by djs**. Each version has changes, most of which are very unnecessary.

Also, it's a fact that **updates take a long time**, you can't use new features, which happens more and more since Discord keeps introducing new features

As example the v13 Modal PR isn't merged yet and its already 1 month, where as discordeno.js had it on the beginning date of the launch.

### __A migration would require breaking changes too?__
We built the interface so that it can be used to **switch between different libraries** with very minor changes on Discordeno's side. This allows us to introduce support for other libraries, such as the Raw API

Of course, a migration would include breaking changes, as we decided to improve the coding experience by simplifying it while incorporating high coding standards

~~As of now, the biggest change is that ids use `BigInts` instead of the usual strings. This is because they use less memory. Therefore, depending on the database, you would have to stringfying the id before saving the document~~ The snowflake transformer has been overwritten to use strings instead of BigInts.

**Common changes are listed in the [gist](https://gist.github.com/meister03/2f8697512e039f1081b16d245bbcc6df), which is updated on the fly**

The wrapper supports commonly used functions such as `.send`, `.pin`, `.create`... . There might be a lack of other functions, but this can be easily added via a PR with a very less coding knowledge.

## Features:
* Custom Property Caching
* Raw Cache Storage
* Structures of common Resources (Guilds, Channels, Users, Roles, Emojis, etc.)
* Builders for common Resources (Embeds, Components)
* Collectors

## Guide:
* [Getting Started](https://discordeno.mod.land/docs/nodejs/getting-started)

## Documentation:
The package is on a very early stage, currently its a lacking a documentation.

## Whitepaper:
#### Discord.Client
```js
const Discord = require('discordeno.js');
const baseBot = Discord.createBot({
  events: {
      ready: () => {
          console.log('Ready!');
      },
      messageCreate(bot, message){
            console.log(message.content);
      }
  },
  intents: ["Guilds", "GuildMessages"],
  token: config.token,
});

const client = Discord.enableCachePlugin(baseBot, {
    guilds: {
        properties: ['id', 'members', 'name', 'roles', 'channels', 'emojis'],
    },
    roles: {
        properties: ['id', 'name', 'permissions'],
    },
    channels: {
        properties: ['id', 'name', 'type', 'messages'],
    },
    users: {
        properties: ['id', 'username', 'discriminator'],
    },
    members: {
        properties: ['id', 'roles', 'name'],
    },
    emojis: {
        properties: ['id', 'name'],
    },
    threads: {
        properties: ['id', 'channelId', 'type'],
    },
    messages: {
        properties: ['id', 'channelId', 'type'],
        .//transformerClass: Discord.Message
    },
    stageInstances: {
        properties: ['id', 'guildId', 'type'],
        //transformerClass: Discord.StageInstance
    },
});
Discord.startBot(client);
```
## Convert Discordeno Objects to Structures
### Guild:
```js
const guild = client.guilds.forge(ddGuild);
```
### Emoji:
```js
const emoji = client.emojis.forge(ddEmoji);
```
### Role:
```js
const role = client.roles.forge(ddRole);
```
### Member:
```js
const member = client.members.forge(ddMember);
```
### User:
```js
const user = client.users.forge(ddUser);
```
### Channel:
```js
const channel = client.channels.forge(ddChannel);
```
### Message:
```js
const message = client.messages.forge(ddMessage;
```

### Get raw data of a structure:
```js
const guild = client.guilds.cache.get(guildId);
const rawData = guild._raw;

const rawData2 = client.guilds.cache._get(guildId);
// Same accounts for other structures
```

### Open Collector:
```js
 // this.client.eventListener must exist, which is a eventEmitter created manually and fires when a event has been fired
 const filter = (m) => m.data?.customId === "warn_modal";
 const collector = new Collector("interactionCreate", { client: this.client, timeout: 60000, filter });
```

## Builders:
### Embed:
* [`new Discord.Embed`](https://discordeno.mod.land/docs/nodejs/Structures/embeds)
### Component:
* [`new Discord.Component`](https://discordeno.mod.land/docs/nodejs/Structures/components)

# Bugs, glitches and issues

If you encounter any problems feel free to open an issue in our <a href="https://github.com/meister03/discordeno.js/issues">GitHub repository or join the Discord server.</a>

# Credits

All Credits goes to the [discordeno library](https://discordeno.mod.land/).