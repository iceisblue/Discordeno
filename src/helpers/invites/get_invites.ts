import { RequestManager } from "../../rest/request_manager.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Get all the invites for this guild. Requires MANAGE_GUILD permission */
export async function getInvites(guildId: string) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  const result = await RequestManager.get(endpoints.GUILD_INVITES(guildId));

  return result;
}
