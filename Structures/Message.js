// @ts-check
const DestructObject = require("./DestructObject");
const Collection = require("./Collection");
const Embed = require("./Embed");
const {transformOptions, transformAttachments} = require("../Util/transformOptions");

class Message extends DestructObject {
  constructor(client, message = {}, options = {}) {
    super(message);
    this.client = client;
    if (options.guild) this.guild = options.guild;
    else this.guild = client.guilds.forge({ id: this.guildId });
    this.channel = this.guild.channels.forge({ id: this.channelId }, { guild: this.guild });
    this.author = client.users.forge(message.author);
    this.member = this.guild.members.forge({ ...message.member, id: this.authorId }, { guild: this.guild, user: message.author });
  }

  async edit(options) {
    options = transformOptions(options);

    if(options.files|| options.attachments){
      options.file = transformAttachments(options.files || options.attachments);
    }

    if(options.embeds){
      options.embeds = options.embeds.map((e)=> {
        return new Embed(e).toJSON();
      });
    }

    return this.client.helpers.editMessage(this.channel.id, this.id, options);
  }

  async reply(options = {}) {
    options = transformOptions(options, {content: true});

    if(options.files || options.attachments){
      options.file = transformAttachments(options.files || options.attachments);
    }

    if (!options.messageReference) {
      options.messageReference = { messageId: this.id, channelId: this.channel.id, guildId: this.guild.id };
    }
    const msg = await this.client.helpers.sendMessage(this.channel.id, options);
    return this.client.messages.forge(msg, { guild: this.guild , channel: this.channel });
  }

  async delete(options = {}) {
    options = transformOptions(options);
    const res = await this.client.helpers.deleteMessage(this.channel.id, this.id, options.reason, options.delayMilliseconds);
    return true;
  }

  async react(emoji) {
    const res = await this.client.helpers.addReaction(this.channel.id, this.id, emoji);
    return this;
  }

  async pin() {
    const res = await this.client.helpers.pinMessage(this.channel.id, this.id);
    return this;
  }

  async unpin() {
    const res = await this.client.helpers.unpinMessage(this.channel.id, this.id);
    return this;
  }


  ///Parse Members:
  get mentions()  {
    const channels = new Collection();
    const members = new Collection();
    const roles = new Collection();
    const users = new Collection();
  
    this.mentionedUsers.forEach((u)=> {
      users.set(u, this.client.users.forge(u));
    })

    this.mentionedRoleIds.forEach((r)=> {
      roles.set(r, this.guild.roles.forge({ id: r }, { guild: this.guild }));
    })

    this.mentionedChannelIds.forEach((c)=> {
      channels.set(c, this.guild.channels.forge({ id: c }, { guild: this.guild }));
    })

    return {
      channels,
      members,
      roles,
      users,
    }

  }

}
module.exports = Message;
