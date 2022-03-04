
import { getBotById, getBotByUserId, getBots, updateBot, updateBotByUserId } from '../DAL/biderBotDbOperations';
import {
    create,
    get,
    getById,
    update,
    del
} from '../DAL/itemDbOperations'


export const fetchItemsList = async (userId, userRole, query) => {
    const { page, search } = query
    let result = [];
    console.log(query);
    if (userRole === 'admin') {
        result = await (await get(search)).filter(item => item.adminId == userId);
    }
    else {
        result = await get(search);
    }

    const pageOptions = {
        total: 0,
        current: 0,
    }

    pageOptions.total = Math.ceil(result.length / 10);
    pageOptions.current = isNaN(page) || parseInt(page) > pageOptions.total ? 0 : parseInt(page);

    result = result.splice(pageOptions.current * 10, 10);
    return [result, pageOptions];
}

export const createItem = async (itemObj) => {
    const result = await create({ ...itemObj, auctionEndsAt: new Date(itemObj.auctionEndsAt).toUTCString() });
    return result;
}

export const getItemById = async (id) => {

    const result = await getById(id);
    return result;
}
// ---item update---
export const updateItem = async (id, itemObj) => {

    if (itemObj?.auctionEndsAt) {
        itemObj.auctionEndsAt = new Date(itemObj.auctionEndsAt).toUTCString()
    }
    const result = await update(id, itemObj);
    return result;
}
export const deleteItem = async (id) => {
    const result = await del(id);
    return result;
}

// --- function to perform bid by user---
export const performBid = async (itemId, bidAmount, userId) => {
    try {
        // get current item
        const item = await getById(itemId);
        console.log(itemId, bidAmount, userId);

        // perform checks
        if (!item) return Promise.reject("cant find item");

        if (new Date().toUTCString() > new Date(item.auctionEndsAt).toUTCString()) return Promise.reject("time already ellapsed");

        if (userId == item.currentBid.bidderId) return ({ msg: "You already have higher bid", status: false });

        if (bidAmount <= item.currentBid.price && bidAmount <= item.basePrice) return Promise.reject("your bid is less then current bid")

        // perform bid
        let newbid = { currentBid: { price: bidAmount, bidderId: userId } };
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
    console.log(itemId, userId, status);
    let bot = await getBotByUserId(userId)
    if (!bot) return Promise.reject("Cant find bot for this user")

    // return Promise.reject("Cant find bot for this user")
    let { _id: botId, ItemIdsForAutoBid: itemKeys } = bot;
    // changings
    const index = itemKeys.indexOf(itemId);
    if (status === "DEACT") {
        if (index === -1) return bot;
        itemKeys.splice(index, 1)
    }
    if (status === "ACT") {
        if (index != -1) return bot;
        itemKeys.push(itemId)
    }
    // update bot
    const result = await updateBot(botId, { ...bot, ItemIdsForAutoBid: [...itemKeys] })
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
    const result = await updateBotByUserId(userId, bot)
    return result;
}
export const getAutoAlert = async (userId) => {

    const bot = await getBotByUserId(userId)
    let amount = 0;

    for (const i in ItemIdsForAutoBid) {

        const itemId = ItemIdsForAutoBid[i];

        const item = await getItemById(itemId);

        if (newBidPrice + amount > bot.maxBalance) {
            return true
        }

    }

    const percent = (amount / bot.maxBalance) * 100;
    if (bot.notifyAt <= percent) return true
    return false
}