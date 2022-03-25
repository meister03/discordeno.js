import {
    Bot,
    Transformers,
    Message,
    Member,
    User,
    Guild,
    Role,
    Channel,
    Emoji,

    DiscordEmoji,
    DiscordMessage,
    DiscordGuild,
    DiscordMember,
    DiscordUser,
    DiscordEmbed,
    DiscordEmbedField,
    DiscordGatewayPayload,


    GatewayManager,
} from "discordeno";

import ChannelManager from "../../Managers/ChannelManager";
import RoleManager from "../../Managers/RoleManager";
import MemberManager from "../../Managers/MemberManager";
import UserManager from "../../Managers/UserManager";
import GuildManager from "../../Managers/GuildManager";
import MessageManager from "../../Managers/MessageManager";
import EmojiManager from "../../Managers/EmojiManager";
import InteractionManager from "../../Managers/InteractionManager";

export class CacheManager {
    public static overwriteHandlers: overwritesHandler;
    public static enableCachePlugin(bot: Bot | Client, options: PluginOptions):overwritesHandler;
}

export type overwritesHandler = Client;


export interface PluginOptions {
    channels?: CacheOptions;
    guilds?: CacheOptions;
    users?: CacheOptions;
    roles?: CacheOptions;
    emojis?: CacheOptions;
    messages?: CacheOptions;
    members?: CacheOptions;
}

export interface CacheOptions {
    properties?: String[];
    maxSize?: number;
    transformerClass?: any;
    sweepFilter?: Function;
}


export interface Client extends Bot {
    channels: ChannelManager;
    roles: RoleManager;
    members: MemberManager;
    users: UserManager;
    guilds: GuildManager;
    messages: MessageManager;
    emojis: EmojiManager;
    interactions: InteractionManager;
    transformers: editedTransformers;

    gateway: editedGatewayManager;
}

export interface editedGatewayManager extends GatewayManager {
    handleDiscordPayload(bot: Client, packet: DiscordGatewayPayload, shardId: number): void;
}

export interface editedTransformers extends Transformers {
    member(bot: Client, member: editedMemberPayload, guildId: BigInt, userId: BigInt): editedMember;
    guild(bot: Client, guild: editedGuildPayload): editedGuild;
    emoji(bot: Client, emoji: DiscordEmoji): Emoji;
    user(bot: Client, user: DiscordUser): User;
    role(bot: Client, role: DiscordRole): Role;
    channel(bot: Client, channel: DiscordChannel): Channel;
    message(bot: Client, message: editedMessagePayload): editedMessage;
    embed(bot: Client, embed: DiscordEmbed): editedDiscordEmbed;
}

export interface editedMember extends Member {
    user: User;
}

export interface editedMemberPayload extends DiscordMember {
    user?: DiscordUser;
}

export interface editedGuild extends Guild {
    channels: Array[Channel];
    members: Array[Member];
    roles: Array[Role];
    emojis: Array[Emoji];
}

export interface editedGuildPayload extends DiscordGuild {
    guild: editedGuild;

}

export interface editedMessage extends Message {
    author: User;
    mentionedUsers: Array[User];
}

export interface editedMessagePayload extends DiscordMessage {
    member?: DiscordMember;
}

export interface editedDiscordEmbed extends DiscordEmbed {
    fields?: Array[DiscordEmbedField] | [];
}