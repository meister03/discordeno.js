import { CreateGuildChannel } from "discordeno";
import { Collection } from "../Util/Collection";
import { Client } from "./CacheManager";
import { Channel, editChannelData } from "../Structures/Channel";

import { GuildManager } from "./GuildManager";

export class ChannelManager {
    constructor(client: Client, data: object, options: object)
    public client: Client;
    public cache: options.cache | Collection;
    public guild: options.guild ;
    public create(options: CreateGuildChannel, reason?: string): Promise<Channel.create>;
    public edit(options: editChannelData, reason?: string): Promise<Channel.edit>;
    public delete(reason: string): Promise<Channel.delete>
    public fetch(id: string): Promise<Channel>;
    public fetch(): Promise<Collection[Channel]>;
    public forge(): Channel;
    public forgeManager(): ChannelManager;
}

export interface Options {
    channels?: Collection[Channel];
    guild?: GuildManager;
}