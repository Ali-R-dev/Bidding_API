import { getBotById, getBotByUserId, getBots, updateBot } from '../DAL/biderBotDbOperations';
import {
    create,
    get,
    getById,
    update,
    del
} from '../DAL/itemDbOperations'


export const fetchItemsList = async () => {
    const result = await get();
    return result;
}

export const createItem = async (itemObj) => {
    const result = await create(itemObj);
    return result;
}

export const getItemById = async (id) => {
    const result = await getById(id);
    return result;
}
export const updateItem = async (id, itemObj) => {
    const result = await update(id, itemObj);
    return result;
}
export const deleteItem = async (id) => {
    const result = await del(id);
    return result;
}

export const performBid = async (itemId, bidAmount, userId) => {
    try {
        // get current item
        const item = await getById(itemId);

        // perform checks
        if (!item) return Promise.reject("cant find item");

        if (new Date().getTime() > item.auctionEndsAt.getTime()) return Promise.reject("time already ellapsed");

        if (userId == item.currentBid.bidderId) return ("You already have higher bid");

        if (bidAmount <= item.currentBid.price && bidAmount <= item.basePrice) return Promise.reject("your bid is less then current bid")

        // perform bid
        let newbid = { currentBid: { price: 100, bidderId: userId } };
        const result = await update(itemId, newbid, true)
        return result;

    } catch (error) {
        const { message } = error;
        return Promise.reject(message)
    }
}



//--------Bot Area--------

export const toogleAutobid = async (itemId, userId, status) => {
    // get bot
    const bot = await getBotByUserId(userId)
    if (!bot) return Promise.reject("Cant find bot for this user")

    let { _id: botId, ItemIdsForAutoBid: itemKeys } = bot;
    // changings
    const index = itemKeys.indexOf(itemId);
    if (status === "DEACT") {
        console.log(itemKeys);
        if (index === -1) return bot;
        itemKeys.splice(index, 1)
    }
    if (status === "ACT") {
        if (index != -1) return bot;
        itemKeys.push(itemId)
    }
    // update bot
    const result = await updateBot(botId, { ItemIdsForAutoBid: [...itemKeys] })
    return result;
}

export const getAllAutoBots = async () => {
    const result = await getBots();
    return result;
}
export const getAutoBotByUserId = async (id) => {
    const result = await getBotByUserId(id)
    return result;
}
export const updateAutoBot = async (userId, bot) => {
    const result = await updateBot(userId, bot)
    return result;
}