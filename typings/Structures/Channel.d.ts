import {Channel as DDChannel, CreateGuildChannel, CreateMessage} from 'discordeno'
import {MessageManager} from '../Managers/MessageManager';
import {Message} from './Message';
import {Guild} from './Guild';

export class Channel extends DDChannel {
    constructor(client: Client, data: DDChannel, options: object)
    public _raw: DDChannel;
    public guild: Guild;
    public messages: MessageManager;
    public create(options: CreateGuildChannel, reason?: string): Promise<Channel>;
    public edit(options: editChannelData, reason?: string): Promise<Channel>;
    public delete(reason?: string): Promise<true>
    public fetch(id: string): Promise<Channel>;
    public fetch(id: bigint): Promise<Channel>;

    public send(options: CreateMessage): Promise<Message>;
}

export interface ChannelData extends DDChannel{
    type?: number;
    permissionOverwrites?: DDChannel.permissionOverwrites;
    botIsMember?: boolean;

}

export interface editChannelData extends CreateGuildChannel{
    id: bigint;
    guildId?: bigint;
    name?: string;
}

export interface deleteChannelData extends ChannelData {
    id: bigint;
    guildId?: bigint;
    reason?: string;
}

export interface fetchChannelData extends ChannelData{
    id: bigint;
    guildId?: bigint;
}

export interface createChannelData extends ChannelData{
    name: string;
    id?: bigint;
    guildId?: bigint;
}