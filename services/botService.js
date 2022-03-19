import { getActiveBots, updateBotByUserId } from '../DAL/biderBotDbOperations';
import { getById as getItemById } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid, updateAutoBot } from '../services/commonServices'

import { getBidById } from '../DAL/bidDbOperations'
const ExecBidderBots = async () => {

    // get active bots
    const activeBotsList = await getActiveBots();
    if (!activeBotsList) return

    // select 1st bot

    for (const i in activeBotsList) {

        let bot = activeBotsList[i];
        await console.log("---in---", bot.userId);

        let itemIdsList = bot.ItemIdsForAutoBid;

        // check for max balance reached

        for (const j in itemIdsList) {
            let itemId = itemIdsList[j]
            const item = await getItemById(itemId);

            const currentBid = await getBidById(item.currentBid);
            // ------------------------------------------
            let newBidPrice = Math.max(item.currentBid.price, item.basePrice) + 1;
            if (await calculateMaxAmount(bot, itemIdsList, itemId, newBidPrice)) {
                await createNotificationArray(bot, `Autobidding stopped for " ${item.name} " due to lack of amount`, 1)
                await toogleAutobid(itemId, bot.userId, "DEACT");
                continue;
            }

            await performBid(itemId, newBidPrice, bot.userId).then(

                async (resol) => {

                    if (resol?.status == true) {
                        await createNotificationArray(bot, `Bid performed by autobidder on " ${item.name} " `, 0)
                    }
                    console.log("Auto bid performed by ", bot.userId, resol)
                }
                ,
                async (rej) => {
                    await createNotificationArray(bot, `Autobidding stopped for " ${item.name} "`, 1)
                    console.log("cannot perform bid ", rej);
                    await toogleAutobid(itemId, bot.userId, "DEACT");
                });

        }
        console.log("---out---", bot.userId);
    }
}



const calculateMaxAmount = async (bot, itemIdsList, currentItemId, newBidPrice) => {

    let amount = 0;
    let currentItemPrice = 0;
    // itemIdsList = itemIdsList.filter(i => i !== currentItemId)
    for (const i in itemIdsList) {

        const itemId = itemIdsList[i];

        const item = await getItemById(itemId);

        if (item.currentBid.bidderId === bot.userId && item._id != currentItemId)
            amount += item.currentBid.price;
        else currentItemPrice = item.currentBid.price
    }

    const percent = ((amount + currentItemPrice) / bot.maxBalance) * 100;
    console.log(percent, amount, bot.notifyAt);
    if (percent > bot.notifyAt) {
        await createNotificationArray(bot, `Bot already used ${percent} % amount`, 2)
    }

    if (newBidPrice + amount > bot.maxBalance) {
        return true
    }
    return false

}

const createNotificationArray = async (bot, message, code) => {

    let notifyList = bot.notifications;
    if (code == 2) notifyList = notifyList.filter(e => e.typeCode !== 2)
    notifyList.unshift({
        message: message,
        typeCode: code,
        time: new Date().toUTCString()
    })
    await updateBotByUserId(bot.userId, { notifications: notifyList })
    return;
}


export const RunBidderBots = async () => {

    //await ExecBidderBots()

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