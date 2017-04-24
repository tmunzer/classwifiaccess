const CronJob = require("cron").CronJob;
const Account = require('./models/account');
const OAuth = require('./aerohive/api/oauth');
const devAccount = require("../config.js").devAccount;

function refreshOldToken() {
    console.info("\x1b[32minfo\x1b[0m:", "Starting process to automatically refresh Access Tokens");

    const tsInOneMonth = new Date().setMonth(new Date().getMonth() + 1);
    // select accounts where:
    // expireAt is not 0 (this means the previous try failed)
    // expireAt is lower than "now + 1 month" (the token will expire in less than one month)
    Account
        .where("expireAt").gt(0)
        .where("expireAt").lte(tsInOneMonth)
        .exec(function (err, accounts) {
            if (err) console.error("\x1b[31mERROR\x1b[0m:", err);
            // for every selected accounts, try to refresh the token
            else accounts.forEach(function (account) {
                console.info("\x1b[32minfo\x1b[0m:", "Refreshing token for ownerId " + account.ownerId);
                OAuth.refreshToken(account.refreshToken, devAccount, function (data) {
                    // if refresh succeed, update the account data
                    if (data.access_token && data.expires_in && data.refresh_token) {
                        account.accessToken = data.access_token;
                        account.expireAt = new Date().valueOf() + (data.expires_in * 1000)
                        account.refreshToken = data.refresh_token;
                        console.info("\x1b[32minfo\x1b[0m:", "Token refreshed for ownerId " + account.ownerId);
                    // if all the needed fields are not received:
                    // - set the "expireAt" field to 0 (mean it failed, so we will not try this account next time)
                    // - raise an error
                    } else {
                        account.expireAt = 0;
                        if (data.error) console.error("\x1b[31mERROR\x1b[0m:", "Unable to refresh the token for ownerId " + account.ownerId + " - " + data.error_description);
                        else console.error("\x1b[31mERROR\x1b[0m:", "Unable to refresh the token for ownerId " + account.ownerId + " - No data received from ACS?");                        
                    }
                    // save the updated account
                    account.save(function () {
                        if (err) console.error("\x1b[31mERROR\x1b[0m:", err);
                        else console.info("\x1b[32minfo\x1b[0m:", "Account saved for " + account.ownerId);
                    })
                })
            })
        })
}
//===============CREATE CRON=================
module.exports.auto = function () {
    // run once when the server is starting
    refreshOldToken();
    try {
        console.log("auto started");
        new CronJob({
            // run the refresh process every month
            cronTime: "0 0 0 0 */1 *",
            onTick: function () {
                refreshOldToken();
            },
            start: true
        });
    } catch (ex) {
        console.error("\x1b[31mERROR\x1b[0m:", "cron pattern not valid");
    }
}
