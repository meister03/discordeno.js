import { CreateGuildEmoji } from "discordeno";
import { Collection } from "../Util/Collection";
import { Client } from "./CacheManager";
import { Emoji, editEmojiData } from "../Structures/Emoji";

import { GuildManager } from "./GuildManager";

export class EmojiManager {
    constructor(client: Client, data: object, options: object)
    public client: Client;
    public cache: options.cache | Collection;
    public guild: options.guild ;
    public create(options: CreateGuildEmoji, reason?: string): Promise<Emoji.create>;
    public edit(options: editChannelData, reason?: string): Promise<Emoji.edit>;
    public delete(reason: string): Promise<Emoji.delete>
    public fetch(id: string): Promise<Emoji>;
    public fetch(): Promise<Collection[Emoji]>;
    public forge(): Emoji;
    public forgeManager(): EmojiManager;
}

export interface Options {
    channels?: Collection[Emoji];
    guild?: GuildManager;
}