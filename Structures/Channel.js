// @ts-check
const DestructObject = require("./DestructObject");
const PermissionOverwrites = require("./permissionOverwrites");
const Permissions = require("./Permissions");
const Webhook = require("./Webhook");
const Collection = require("./Collection");
const { transformOptions, transformAttachments, transformPermissionOverwrites } = require("../Util/transformOptions");
const { separateOverwrites } = require("../Util/Util");

class Channel extends DestructObject {
  /** 
  * Creates a Channel Instance from the Discordeno Channel object
  * @param {import('../typings/Managers/CacheManager').Client} client Discordeno.js Client
  * @param {import('discordeno').Channel} channel Discordeno Channel Data
  * @param {import('../typings/Managers/ChannelManager').Options} options Options for retrieving existing Structures
  */
  constructor(client, channel = {}, options = {}) {
    super(channel, { "permissionOverwrites": true });
    this.client = client;

    if (options.guild) this.guild = options.guild;
    else if (channel.guildId) this.guild = client.guilds.forge({ id: channel.guildId });

    this.messages = client.messages.forgeManager({}, { messages: options.messages, channel: this, guild: this.guild });
  }

 /**
 * Creates a GuildChannel of a given type[number]
 * @param {import('../typings/Structures/Channel').createChannelData} options The options to create the GuildChannel with
 * @param {string|undefined} reason The reason of the channel creation
 * @return {Promise<import('../typings/Structures/Channel').Channel>} Channel Instance
 * @example
 *  const channel = await client.channels.create({name: "test"}, "I like this new channel");
 *     
 */
  async create(options = {}, reason) {
    options = transformOptions(options);
    if (options.permissionOverwrites) {
      options.permissionOverwrites = transformPermissionOverwrites(options.permissionOverwrites);
    }
    const guildId = options.guildId || this.guildId;
    const channel = await this.client.helpers.createChannel(guildId, options, reason);
    return this.client.channels.forge(channel, { guild: this.guild });
  }

  /**
  * Edits a existing GuildChannel
  * @param {import('../typings/Structures/Channel').editChannelData} options The options to edit the GuildChannel with
  * @param {string|undefined} reason The reason for editing the channel  
  * @return {Promise<import('../typings/Structures/Channel').Channel>} Channel Instance
  * @example
  *  const editedChannel = await channel.edit({id: '123', name: "test"}, "I am changing the name");
  *     
  */
  async edit(options = {}, reason) {
    options = transformOptions(options);
    if (options.permissionOverwrites) {
      options.permissionOverwrites = transformPermissionOverwrites(options.permissionOverwrites);
    }
    const channel = await this.client.helpers.editChannel(this.id, options, reason);
    return this.client.channels.forge(channel, { guild: this.guild });
  }

  /**
  * Deletes a existing GuildChannel
  * @param {string|undefined} reason The options for deleting the GuildChannel with
  * @return {Promise<Boolean>} Whether the channel deleted successfully
  * @example
  *  const deleted = await channel.delete({id: '123'}, "I don't like this channel anymore");
  *     
  */
  async delete(reason) {
    const op = await this.client.helpers.deleteChannel(this.id, reason);
    return true;
  }

  /**
  * Fetches a existing GuildChannel or all guild channels
  * @param {import('../typings/Structures/Channel').fetchChannelData} options The options for fetching
  * @return {Promise<import('../typings/Structures/Channel').Channel|Map<import('../typings/Structures/Channel').Channel>>} Channel Instance
  * @example
  *  const fetchedChannel = await channel.fetch();
  */
  async fetch(options = {}) {
    options = transformOptions(options);
    if (!options.id) options.id = this.id;
    return this.client.channels.fetch(options);
  }

  async send(options = {}) {
    options = transformOptions(options, { content: true });

    if (options.attachments || options.files) {
      options.file = transformAttachments(options.attachments || options.files);
    }

    const msg = await this.client.helpers.sendMessage(this.id, options);
    return this.client.messages.forge(msg, { channel: this, guild: this.guild });
  }

  async bulkDelete(options = {}, reason) {
    options.map(x => BigInt(x?.id ? x.id : x));
    return this.client.helpers.deleteMessages(this.id, options, reason);
  }

  get permissionOverwrites() {
    const cache = new Collection();

    this._permissionOverwrites.forEach(x => {
      let [type, id, allow, deny] = separateOverwrites(x);

      if (allow !== undefined) allow = new Permissions(allow).toArray();
      if (deny !== undefined) deny = new Permissions(deny).toArray();

      cache.set(id, new PermissionOverwrites(this.client, { type, id, allow, deny }, { channel: this }));
    })

    return new PermissionOverwrites(this.client, {}, { channel: this, permissionOverwrites: cache });
  }

  // @todo
  permissionsFor({ id }) {
    return this.permissionOverwrites.get(id);
  }


  //Webhook
  async createWebhook(options = {}) {
    const webhook = await this.client.helpers.createWebhook(this.id, options);
    return new Webhook(this.client, webhook);
  }

  async fetchWebhooks() {
    const webhooks = await this.client.helpers.getChannelWebhooks(this.id);
    const webhooksCollection = new Collection();
    webhooks.map(x => {
      webhooksCollection.set(x.id, new Webhook(this.client, x));
    });
    return webhooksCollection;
  }

}
module.exports = Channel;
