import {Channel as DDChannel, CreateGuildChannel, CreateMessage} from 'discordeno'
import {MessageManager} from '../Managers/MessageManager';
import {Message} from './Message';

export class Channel extends DDChannel {
    constructor(client: Client, data: DDChannel, options: object)
    public _raw: DDChannel;
    public messages: MessageManager;
    public create(options: CreateGuildChannel, reason?: string): Promise<Channel>;
    public edit(options: editChannelData, reason?: string): Promise<Channel>;
    public delete(reason?: string): Promise<true>
    public fetch(id: string): Promise<Channel>;

    public send(options: CreateMessage): Promise<Message>;
}

export interface editChannelData extends CreateGuildChannel{
    id: bigint;
    guildId?: bigint;
    name?: string;
}

export interface deleteChannelData {
    id: bigint;
    guildId?: bigint;
    reson?: string;
}

export interface fetchChannelData {
    id: bigint;
    guildId?: bigint;
}