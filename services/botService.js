import Mongoose from 'mongoose';
import { getActiveBots, updateBotByUserId } from '../DAL/biderBotDbOperations';
import { getById as getItemById, get as getItems, update as updateItem } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid, updateAutoBot } from '../services/commonServices'
import { getUser } from '../DAL/userDbOperations'
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
                continue;
            }
            await performBid(itemId, newBidPrice,
                {

                    _id: bot.userId, role: 'REG'
                }).then(

                    (resol) => {

                        if (resol.status) {
                            console.log("Cannot perform:", resol.msg);

                            // await createNotificationArray(bot, `Bid performed by autobidder on " ${item.name} " `, 0)
                        } else {
                            console.log("Auto bid performed by ", bot.userId, resol)
                        }
                    }
                    ,
                    async (rej) => {
                        // await createNotificationArray(bot, `Autobidding stopped for " ${item.name} "`, 1)
                        console.log("cannot perform bid ", rej);
                        await toogleAutobid(itemId, "DEACT", {
                            _id: bot.userId, role: 'REG'
                        });
                    });

        }
        console.log("---out---", bot.userId);
    }
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

    console.log(",N:", newBidPrice, ",T:", (amount + newBidPrice), ",M:", bot.maxBalance, ",S:", bot.maxBalance > (amount + newBidPrice));

    if ((newBidPrice + amount) <= bot.maxBalance) {
        return newBidPrice
    }
    return undefined;
}

// const createNotificationArray = async (bot, message, code) => {

//     let notifyList = bot.notifications;
//     if (code == 2) notifyList = notifyList.filter(e => e.typeCode !== 2)
//     notifyList.unshift({
//         message: message,
//         typeCode: code,
//         time: new Date().toUTCString()
//     })
//     await updateBotByUserId(bot.userId, { notifications: notifyList })
//     return;
// }




export const RunBotService = async () => {

    let lock = false;
    setInterval(async () => {
        console.log("--start interval--");
        if (lock == false) {
            lock == true
            console.log("-start Bot-");
            await ExecBidderBots()
            console.log("-end bot-");
            lock = false
        }
        console.log("--end interval--");
    }, 2000);
}
