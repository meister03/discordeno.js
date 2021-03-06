// @ts-check
const DestructObject = require("./DestructObject");
const {transformOptions, transformPermissionOverwrites} = require("../Util/transformOptions");
const Collection = require("./Collection");

class permissionOverwrites extends DestructObject {
    /** 
    * @param {import('../typings/Managers/CacheManager').Client} client
    */
    constructor(client, data = {}, options = {}) {
        super(data);
        this.overwriteId = data.overwriteId || data.id;

        this.cache = options.permissionOverwrites ?? new Collection();

        this.channel = options.channel;
        this.client = client;
    }

    has(overwriteId) {
        overwriteId = this.client.transformers.snowflake(overwriteId);
        return this.cache.has(overwriteId);
    }

    get(overwriteId) {
        overwriteId = this.client.transformers.snowflake(overwriteId);
        return this.cache.get(overwriteId);
    }

    async edit(overwriteId, options = {}) {
        if(!overwriteId) overwriteId = options.overwriteId || options.id || this.overwriteId;
        overwriteId = this.client.transformers.snowflake(overwriteId);

        const existing = this.cache?.get(overwriteId) ?? {allow: this.allow ?? [], deny: this.deny ?? [], type: this.type || 'role', id: this.overwriteId};

        options = transformPermissionOverwrites(options);

        const overwrites = {allow: [...options.allow], deny: [...options.deny], type: options.type};

        if(options.allow){
            existing.allow.forEach(x => {
                if(!options.allow.includes(x) && !options.deny.includes(x)) overwrites.allow.push(x);
            })
        }

        if(options.deny){
            existing.deny.forEach(x => {
                if(!options.deny.includes(x) && !options.allow.includes(x)) overwrites.deny.push(x);
            })
        }

        if(options.neutral){
            options.neutral.forEach(x => {
                if(overwrites.allow.includes(x)) overwrites.allow.splice(overwrites.allow.indexOf(x), 1);
                if(overwrites.deny.includes(x)) overwrites.deny.splice(overwrites.deny.indexOf(x), 1);
            })
        }

        options.allow = overwrites.allow;
        options.deny = overwrites.deny;
        delete options.neutral;
        
        if(!options.type) options.type = overwrites.type;
        
        const channelId = options.channelId || this.channel?.id;

        options.id = overwriteId;
        return this.client.helpers.editChannelOverwrite(channelId, options);
    }

    async create(...args){
        return this.edit(...args);
    }

    delete(options = {}) {
        options = transformOptions(options);

        const channelId = options.channelId || this.channel?.id;
        const overwriteId = options.overwriteId || options.id || this.overwriteId;

        return this.client.helpers.deleteChannelOverwrite(channelId, overwriteId);
    }
}
module.exports = permissionOverwrites;