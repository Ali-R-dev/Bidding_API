
import { getBotById, getBotByUserId, getBots, updateBot, updateBotByUserId } from '../DAL/biderBotDbOperations';

import {
    create,
    get,
    getById,
    update,
    del
} from '../DAL/itemDbOperations'

import { createBid, getBidById } from '../DAL/bidDbOperations'


export const fetchItemsList = async (user, query) => {

    try {

        const { page, search } = query
        let result = [];
        // --- filtration ---
        if (user.role === 'ADM') {
            result = await (await get(search)).filter(item => user._id.equals(item.adminId));
        }
        else {
            result = await get(search);
        }

        const pageOptions = {
            total: 0,
            current: 0,
        }
        // ---for paginaton---
        pageOptions.total = Math.ceil(result.length / 10);
        pageOptions.current = isNaN(page) || parseInt(page) > pageOptions.total ? 0 : parseInt(page);

        result = result.splice(pageOptions.current * 10, 10);
        return [result, pageOptions];

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }
}


export const createItem = async (itemObj, user) => {
    try {
        // ---validation---
        if (user.role !== 'ADM') return Promise.reject({ msg: "Unauthorized to create new item" })
        const result = await create({ ...itemObj, auctionEndsAt: new Date(itemObj.auctionEndsAt).toUTCString(), adminId: user._id });
        return result;

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }

}


export const getItemById = async (id, user) => {

    const result = await getById(id);
    // ---validation---
    if (result && user.role === 'ADM' && !user._id.equals(result.adminId)) {
        return Promise.reject({ msg: "Unauthorized to access" })
    }
    return result;
}


export const updateItem = async (id, itemObj, user) => {

    try {

        const item = await getById(id);

        // ---validation before update---

        if (!item) return Promise.reject({ msg: "No record found for update" })

        if (user.role !== 'ADM' || !user._id.equals(item.adminId)) return Promise.reject({ msg: "unauthorized to update" })

        if (item.isSoled == true) return Promise.reject({ msg: "cant update , Item Already sold" })

        if (itemObj?.auctionEndsAt) {
            itemObj.auctionEndsAt = new Date(itemObj.auctionEndsAt).toUTCString()
        }

        const result = await update(id, itemObj);
        return result;

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }
}


export const deleteItem = async (id, user) => {
    try {

        const item = await getById(id);

        // ---validation before delete---
        if (!item) return Promise.reject({ msg: "No item found" })

        if (!user._id.equals(item.adminId)) return Promise.reject({ msg: "Unauthorized to delete" })

        if (item.isSoled) return Promise.reject({ msg: "canot delete , item already sold" })

        // ---del
        const result = await del(id);
        return result;

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }

}
// ---------------------------------




export const performBid = async (itemId, bidAmount, user) => {

    try {

        if (user.role !== "REG") return Promise.reject("Unauthorized to bid");

        // get current item
        const item = await getById(itemId);

        console.log(itemId, bidAmount, user.userId);

        // perform checks
        if (!item) return Promise.reject({ msg: "cant find item" });

        console.log(new Date().getTime(), new Date(item.auctionEndsAt).getTime());

        if (new Date().toUTCString() >= new Date(item.auctionEndsAt).toUTCString()) return Promise.reject({ msg: "time already ellapsed" });

        if (user._id.equals(item.currentBid)) return ({ msg: "You already have higher bid", status: true });

        let currentBidObj = item?.currentBid ? await getBidById(item.currentBid) : { bidPrice: 0 };

        if (bidAmount <= Math.max(item.basePrice, currentBidObj.bidPrice)) return Promise.reject("your bid is less then current bid")

        // perform bid
        let newbid = await createBid(item._id, user._id, bidAmount)
        const result = await update(itemId, {
            currentBid: newbid
                ._id
        }, true)
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