import {Emoji as DDEmoji, CreateGuildEmoji} from 'discordeno';
import {Guild} from './Guild';

export class Emoji extends DDEmoji {
    constructor(client: Client, data: DDChannel, options: object)
    public _raw: DDEmoji;
    public guild: Guild;

    public create(options: CreateGuildEmoji, reason?: string): Promise<Emoji>;
    public edit(options: editEmojiData, reason?: string): Promise<Emoji>;
    public delete(reason?: string): Promise<true>
    public fetch(id: string): Promise<Emoji>;
    public fetch(id: bigint): Promise<Emoji>;
}

export interface EmojiData extends DDEmoji{

}

export interface editEmojiData extends CreateGuildEmoji{
    id: bigint;
    guildId?: bigint;
    name?: string;
}

export interface deleteEmojiData extends EmojiData {
    id: bigint;
    guildId?: bigint;
    reason?: string;
}

export interface fetchEmojiData extends EmojiData{
    id: bigint;
    guildId?: bigint;
}

export interface createEmojiData extends EmojiData{
    name: string;
    id?: bigint;
    guildId?: bigint;
}