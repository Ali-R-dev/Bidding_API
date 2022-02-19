import { getActiveBots } from '../DAL/biderBotDbOperations';
import { getById as getItemById } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid } from '../services/commonServices'

const RunBidderBots = async () => {
    // get active bots
    const activeBotsList = await getActiveBots();
    if (!activeBotsList) return

    // select 1st bot
    array.forEach(bot => {

        // select 1st item
        let itemIdsList = bot.ItemIdsForAutoBid;
        itemIdsList.forEach(itemId => {
            const item = await getItemById(itemId);
            if (!item) return;

            // try to bid otherwise remove itemId
            await performBid(itemId, item.currentBid.price + 1, bot.userId).then(
                (resol) => {
                    console.log("Auto bid performed by ", bot.userId, resol)
                }
                ,
                (rej) => {
                    console.log(rej);
                    toogleAutobid(itemId, bot.userId, "DEACT");
                });
        })
    });



}