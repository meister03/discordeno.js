// @ts-check
const DestructObject = require("./DestructObject");
const { transformOptions, transformAttachments } = require("../Util/transformOptions");

const {INTERACTIONS} = require("../Util/Constants");
const Constants = INTERACTIONS;

class Interaction extends DestructObject {
    /** 
    * @param {import('../typings/Managers/CacheManager').Client} client
    */
    constructor(client, interaction = {}) {
        super(interaction);
        this.raw = interaction;
        this.client = client;

        this.user = client.users.forge(interaction.user);
        this.guild = client.guilds.forge({ id: this.guildId });
        this.channel = client.channels.forge({ id: this.channelId }, { guild: this.guild });
        this.member = this.guild.members.forge({ ...interaction.member, id: this.user.id }, { guild: this.guild, user: interaction.user });
    }

    isCommand() { return this.type === Constants.INTERACTION_TYPES.APPLICATION_COMMAND; }

    // @todo check Context Menu type and Component Type
    isChatInputCommand() { return this.type === Constants.INTERACTION_TYPES.CHAT_INPUT; }
    isContextMenu() { return this.isCommand(); }
    isContextMenuCommand() { return this.isCommand(); }
    isAutoComplete() { return this.type === Constants.INTERACTION_TYPES.APPLICATION_COMMAND_AUTOCOMPLETE; }
    isMessageComponent() { return this.type === Constants.INTERACTION_TYPES.MESSAGE_COMPONENT; }
    isSelectMenu() { return this.type === Constants.INTERACTION_TYPES.MESSAGE_COMPONENT && this.data.values; }
    isButton() { return this.type === Constants.INTERACTION_TYPES.MESSAGE_COMPONENT && !this.data.values; }

    async deferReply(options = {}) {
        const Payload = { data: {}, type: Constants.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE };
        if (this.ephemeral) Payload.private = true;
        this.ephemeral = Payload.private;
        this.deferred = true;
        return this.client.helpers.sendInteractionResponse(this.id, this.token, options);
    }

    async deferUpdate(options = {}) {
        const Payload = { data: options, type: Constants.DEFERRED_UPDATE_MESSAGE };
        this.deferred = true;
        return this.client.helpers.sendInteractionResponse(this.id, this.token, Payload);
    }

    async reply(options = {}) {
        options = transformOptions(options, { content: true });

        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }

        if (options.ephemeral) {
            delete options.ephemeral;
            this.ephemeral = true;
            options.flags = options.flags ? options.flags | Constants.FLAGS.EPHEMERAL : Constants.FLAGS.EPHEMERAL;
        }
        const Payload = { data: options, type: Constants.CHANNEL_MESSAGE_WITH_SOURCE };

        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this.id, this.token, Payload);
    }

    async popupModal(options = {}) {
        options = transformOptions(options);
        const Payload = { data: options, type: Constants.MODAL };

        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this.id, this.token, Payload);
    }

    async editReply(options = {}) {
        options = transformOptions(options, { content: true });

        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }

        this.replied = true;
        return this.client.helpers.editInteractionResponse(this.token, options);
    }

    async deleteReply(options = {}) {
        options = transformOptions(options);
        if(options.id) options.messageId = options.id;

        if (this.ephemeral) throw new Error('Ephemeral messages cannot be deleted');
        
        const messageId = this.messageId ? this.messageId : options.messageId;
        return this.client.helpers.deleteInteractionResponse(this.token, messageId);
    }

    async followUp(options = {}) {
        options = transformOptions(options, { content: true });

        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }

        if (options.ephemeral) {
            delete options.ephemeral;
            this.ephemeral = true;
            options.flags = options.flags ? options.flags | Constants.FLAGS.EPHEMERAL : Constants.FLAGS.EPHEMERAL;
        }

        const Payload = { data: options, type: Constants.CHANNEL_MESSAGE_WITH_SOURCE };
        return this.client.helpers.sendInteractionResponse(this.id, this.token, Payload);
    }

    async update(options = {}) {
        options = transformOptions(options, { content: true });

        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }

        const Payload = { data: options, type: Constants.UPDATE_MESSAGE };
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this.id, this.token, Payload);
    }

}
module.exports = Interaction;