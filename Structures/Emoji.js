// @ts-check
const DestructObject = require("./DestructObject");
const { transformOptions } = require("../Util/transformOptions");
class Emoji extends DestructObject {
  /** 
  * @param {import('../typings/Managers/CacheManager').Client} client
  */
  constructor(client, emoji = {}, options = {}) {
    super(emoji);
    this.client = client;

    if (options.guild) this.guild = options.guild;
    else if (emoji.guildId) this.guild = client.guilds.forge({ id: emoji.guildId });
  }

  async fetch(options){
    options = transformOptions(options);
    if(!options.id) options.id = this.id;
    return this.client.emojis.fetch(options);
  }

  async create(options){
    options = transformOptions(options);
    if(!options.guildId) options.guildId = this.guild?.id;
    const emoji = await this.client.helpers.createEmoji(options.guildId, options);
    return emoji;
  }

  async edit(options){
    options = transformOptions(options);
    if(!options.guildId) options.guildId = this.guild?.id;
    if(!options.id) options.id = this.id;

    const emoji = await this.client.helpers.editEmoji(options.guildId,options.id, options);
    return this.client.emojis.forge(emoji, {guild: this.guild});
  }

  async delete(options){
    options = transformOptions(options);
    if(!options.guildId) options.guildId = this.guild?.id;
    if(!options.id) options.id = this.id;
    const op = await this.client.helpers.deleteEmoji(options.guildId, options.id, options.reason);
   
    return true;
  }

}
module.exports = Emoji;
