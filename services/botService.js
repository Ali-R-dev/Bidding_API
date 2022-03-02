import { getActiveBots } from '../DAL/biderBotDbOperations';
import { getById as getItemById } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid, updateAutoBot } from '../services/commonServices'

const ExecBidderBots = async () => {

    // get active bots
    const activeBotsList = await getActiveBots();
    if (!activeBotsList) return

    // select 1st bot

    for (const i in activeBotsList) {

        let bot = activeBotsList[i];
        await console.log("---in---", bot.userId);

        let itemIdsList = bot.ItemIdsForAutoBid;

        // console.log(bot.userId, bot.ItemIdsForAutoBid);
        // check for max balance reached

        for (const j in itemIdsList) {
            let itemId = itemIdsList[j]
            const item = await getItemById(itemId);

            let newBidPrice = Math.max(item.currentBid.price, item.basePrice) + 1;
            console.log(newBidPrice);
            if (await calculateMaxAmount(bot, itemIdsList, itemId, newBidPrice)) {
                await toogleAutobid(itemId, bot.userId, "DEACT");
                continue;
            }

            await performBid(itemId, newBidPrice, bot.userId).then(

                (resol) => {
                    console.log("Auto bid performed by ", bot.userId, resol)
                }
                ,
                async (rej) => {
                    console.log("cannot perform bid ", rej);
                    await toogleAutobid(itemId, bot.userId, "DEACT");
                });

        }
        console.log("---out---", bot.userId);
    }
}



const calculateMaxAmount = async (bot, itemIdsList, currentItemId, newBidPrice) => {

    let amount = 0;
    itemIdsList = itemIdsList.filter(i => i !== currentItemId)
    for (const i in itemIdsList) {
        const itemId = itemIdsList[i];
        const item = await getItemById(itemId);
        if (item.currentBid.bidderId === bot.userId)
            amount += item.currentBid.price;
        console.log("step ", amount);
    }
    if (newBidPrice + amount > bot.maxBalance) {
        return true
    }
    return false

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