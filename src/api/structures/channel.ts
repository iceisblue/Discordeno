import {
  ChannelCreatePayload,
  ChannelType,
  RawOverwrite,
} from "../../types/types.ts";
import { cache } from "../../util/cache.ts";
import { Collection } from "../../util/collection.ts";
import { createNewProp } from "../../util/utils.ts";
import { cacheHandlers } from "../controllers/cache.ts";
import { Guild } from "./guild.ts";
import { Message } from "./message.ts";

const baseChannel: any = {
  get guild() {
    return cache.guilds.get(this.guildID);
  },
  get messages() {
    return cache.messages.filter((m) => m.channelID === this.id);
  },
  get mention() {
    return `<#${this.id}>`;
  },
};

export async function createChannel(
  data: ChannelCreatePayload,
  guildID?: string,
) {
  const {
    guild_id: rawGuildID,
    last_message_id: lastMessageID,
    user_limit: userLimit,
    rate_limit_per_user: rateLimitPerUser,
    parent_id: parentID,
    last_pin_timestamp: lastPinTimestamp,
    permission_overwrites,
    nsfw,
    ...rest
  } = data;

  const restProps: Record<string, ReturnType<typeof createNewProp>> = {};
  for (const key of Object.keys(rest)) {
    restProps[key] = createNewProp((rest as any)[key]);
  }

  const channel = Object.create(baseChannel, {
    ...restProps,
    guildID: createNewProp(guildID || rawGuildID || ""),
    lastMessageID: createNewProp(lastMessageID),
    userLimit: createNewProp(userLimit),
    rateLimitPerUser: createNewProp(rateLimitPerUser),
    parentID: createNewProp(parentID || undefined),
    lastPinTimestamp: createNewProp(
      lastPinTimestamp ? Date.parse(lastPinTimestamp) : undefined,
    ),
    permissionOverwrites: createNewProp(permission_overwrites || []),
    nsfw: createNewProp(data.nsfw || false),
  });

  cacheHandlers.set("channels", data.id, channel);
  return channel as Channel;
}

export interface Channel {
  /** The id of this channel */
  id: string;
  /** Sorting position of the channel */
  position?: number;
  /** The name of the channel (2-100 characters) */
  name?: string;
  /** The channel topic (0-1024 characters) */
  topic?: string;
  /** The bitrate (in bits) of the voice channel */
  bitrate?: number;
  /** The type of the channel */
  type: ChannelType;
  /** The guild id of the channel if it is a guild channel. */
  guildID: string;
  /** The id of the last message sent in this channel */
  lastMessageID?: string;
  /** The amount of users allowed in this voice channel. */
  userLimit?: number;
  /** The rate limit(slowmode) in this text channel that users can send messages. */
  rateLimitPerUser?: number;
  /** The category id for this channel */
  parentID?: string;
  /** The last time when a message was pinned in this channel */
  lastPinTimestamp?: number;
  /** The permission overwrites for this channel */
  permissionOverwrites: RawOverwrite[];
  /** Whether this channel is nsfw or not */
  nsfw: boolean;

  // GETTERS

  /** 
   * Gets the guild object for this channel.
   * 
   * ⚠️ ADVANCED: If you use the custom cache, these will not work for you. Getters can not be async and custom cache requires async.
   */
  guild?: Guild;
  /** 
   * Gets the messages from cache that were sent in this channel
   * 
   * ⚠️ ADVANCED: If you use the custom cache, these will not work for you. Getters can not be async and custom cache requires async.
   */
  messages: Collection<string, Message>;
  /** The mention of the channel */
  mention: string;
}