
import { getActiveBots } from '../DAL/biderBotDbOperations';
import { getById as getItemById, update as updateItem } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid, updateAutoBot } from '../services/commonServices'
import { getUser } from '../DAL/userDbOperations'
import { createEmailNotification } from './CoreServices'
import { getBidById } from '../DAL/bidDbOperations'
const ExecBidderBots = async () => {

    // get active bots
    const activeBotsList = await getActiveBots();
    if (!activeBotsList) return

    // select 1st bot
    console.log("Active Bots :", activeBotsList.length);
    for (const i in activeBotsList) {

        let bot = activeBotsList[i];

        await console.log("---in---", bot.userId);

        let itemIdsList = bot.ItemIdsForAutoBid;

        for (const j in itemIdsList) {
            let itemId = itemIdsList[j]

            const item = await getItemById(itemId);
            // ------------------------------------------
            const newBidPrice = await getNextBidPrice(bot, item);
            if (!newBidPrice) {
                await toogleAutobid(itemId, "DEACT", {
                    _id: bot.userId, role: "REG"
                });
                await notify(bot.userId, item.name)


                continue;
            }
            await performBid(itemId, newBidPrice,
                {

                    _id: bot.userId, role: 'REG'
                }).then(

                    (resol) => {

                        if (resol.status) {
                            console.log("Cannot perform:", resol.msg);
                        } else {
                            console.log("Auto bid performed by ", bot.userId, resol)
                        }
                    }
                    ,
                    async (rej) => {

                        console.log("cannot perform bid ", rej);
                        await toogleAutobid(itemId, "DEACT", {
                            _id: bot.userId, role: 'REG'
                        });
                        await notify(bot.userId, item.name)
                    });

        }
        console.log("---out---", bot.userId);
    }
}

const notify = async (usrId, itemName, notification) => {

    const user = await getUser({
        _id: usrId
    })
    createEmailNotification({
        user: user,
        notification:
        {
            title: notification.title || "AutoBidder Alert",
            desc: notification.desc || `You AutoBidder is turned of for " ${itemName} " . Thanks`
        }
    })
}

const getNextBidPrice = async (bot, currentItem) => {

    let amount = 0;
    let currentItemPrice = 0;
    let itemIdsList = bot.ItemIdsForAutoBid

    for (const i in itemIdsList) {

        const itemId = itemIdsList[i];

        const item = await getItemById(itemId);


        if (!item.currentBid) {
            if (item._id.equals(currentItem._id))
                currentItemPrice = item.basePrice;

            continue;
        }
        const bid = await getBidById(item.currentBid);

        if (bid.userId.equals(bot.userId)) {

            amount = amount + bid.bidPrice;
        } else {
            if (item._id.equals(currentItem._id))
                currentItemPrice = bid.bidPrice
        }
    }
    const newBidPrice = currentItemPrice + 1;

    const getPercent = ((newBidPrice + amount) / bot.maxBalance) * 100;

    if (getPercent => bot.notifyAt) {
        await notify(bot.userId, "", { title: "Bot Fund Usage Alert", desc: ` Bot Crossed your Notification Limit ${bot.notifyAt}%.` })
    }

    if ((newBidPrice + amount) <= bot.maxBalance) {
        return newBidPrice
    }
    return undefined;
}

export const RunBotService = async () => {

    let lock = false;
    setInterval(async () => {
        // console.log("--start interval--");
        if (lock == false) {
            lock == true
            // console.log("-start Bot-");
            await ExecBidderBots()
            // console.log("-end bot-");
            lock = false
        }
        // console.log("--end interval--");
    }, 2000);
}
