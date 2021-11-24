import { functions } from "../firebase";
import { DISCORD_WEBHOOK_URL } from "../constants";

import * as rp from "request-promise";

////////////////////////////////////////////////////////////////////////////////
// authUserOnCreated
exports.authUserOnCreated = functions.auth.user().onCreate(async (user) => {
    try {
        await rp({
          method: "POST",
          uri: DISCORD_WEBHOOK_URL,
          json: true,
          body: {
              content: `New user! https://campusgamingnetwork.com/user/${user.uid}`,
          },
        });
      } catch (error) {
        return;
      }

      return;
});
