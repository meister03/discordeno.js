// @ts-check
const DestructObject = require("./DestructObject");
const {transformOptions} = require("../Util/transformOptions");

class Webhook extends DestructObject {
  constructor(client, webhook = {}) {
    super(webhook);
    this.client = client;
  }

  async send(options = {}) {
    options = transformOptions(options);

    const id = options.id || this.id;
    const token = options.token || this.token;
    const message = await this.client.helpers.sendWebhookMessage(id,token, options);
    return this.client.messages ? this.client.messages.forge(message) : message;
  }

  async edit(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const webhook = await this.client.helpers.editWebhook(id,options);
    return new Webhook(this.client,webhook);
  } 

  async fetchMessage(options={}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const token = options.token || this.token;

    const messageId = typeof options.messageId === "string" ? this.client.transformers.snowflake(options.messageId) : options.messageId;

    const message = await this.client.helpers.getWebhookMessage(id,token,messageId, options);
    return this.client.messages ? this.client.messages.forge(message) : message;
  }


  async editMessage(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const token = options.token || this.token;

    const messageId = typeof options.messageId === "string" ? this.client.transformers.snowflake(options.messageId) : options.messageId;
    options.messageId = messageId;

    const message = await this.client.helpers.editWebhookMessage(id, token, options);
    return this.client.messages ? this.client.messages.forge(message) : message;
  }

  async delete(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const token = options.token || this.token;
    const reason = options.reason;

    const res = await this.client.helpers.deleteWebhook(id,token,reason);
    return true;
  }
}
module.exports = Webhook;