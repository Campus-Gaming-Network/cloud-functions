const { functions } = require("../firebase");
const { DISCORD_WEBHOOK_URL } = require("../constants");

const rp = require("request-promise");

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
        console.log(error);
        return null;
      }

      return null;
});
