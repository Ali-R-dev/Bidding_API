import Mongoose from 'mongoose';
import { getActiveBots, updateBotByUserId } from '../DAL/biderBotDbOperations';
import { getById as getItemById } from '../DAL/itemDbOperations';
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
            console.log("need new bid", bot.userId);
            // if (await calculateMaxAmount(bot, itemId, newBidPrice)) {
            //     console.log("inside if");
            //     // await createNotificationArray(bot, `Autobidding stopped for " ${item.name} " due to lack of amount`, 1)
            //     // await toogleAutobid(itemId, bot.userId, "DEACT");
            //     // continue;
            // }


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

    // const currentBid = await getBidById(currentItem.currentBid);
    // let newBidPrice = Math.max(currentItem.basePrice, (currentBid?.bidPrice || 0)) + 1;

    // ----------------- itemIdsList = itemIdsList.filter(i => i !== currentItemId)



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

        // if (bid.userId.equals(bot.userId)) {

        //     if (!item._id.equals(currentItem._id)) {
        //         amount = amount + bid.bidPrice;
        //     } else {
        //         currentItemPrice = bid.bidPrice
        //     }
        // }
    }
    const newBidPrice = currentItemPrice + 1;

    console.log(",N:", newBidPrice, ",T:", (amount + newBidPrice), ",M:", bot.maxBalance, ",S:", bot.maxBalance > (amount + newBidPrice));

    if ((newBidPrice + amount) <= bot.maxBalance) {
        return newBidPrice
    }
    return undefined;

    // bot ,item

    /*

itemsList

    select item
    get selected bid
    chek if users are same
    True -> update total
    false -> ignore 




    */



    // const percent = ((amount + currentItemPrice) / bot.maxBalance) * 100;
    // console.log(percent, amount, bot.notifyAt);
    // if (percent > bot.notifyAt) {

    //     console.log(`Bot already used ${percent} % amount`);
    //     // await createNotificationArray(bot, `Bot already used ${percent} % amount`, 2)
    // }

    // if (newBidPrice + amount > bot.maxBalance) {
    //     return true
    // }
    // return false

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