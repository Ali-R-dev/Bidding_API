
import { getBotById, getBotByUserId, getBots, updateBot, updateBotByUserId } from '../DAL/biderBotDbOperations';

import {
    create,
    get,
    getById,
    update,
    del
} from '../DAL/itemDbOperations'

import { getUserById } from './userService';

import { createBid, getBidById, getBidsForItem, getBidsByUserId } from '../DAL/bidDbOperations'


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

        if (itemObj.currentBid == '') delete itemObj.currentBid;

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

        console.log(itemObj);

        if (itemObj?.auctionEndsAt) {
            itemObj.auctionEndsAt = new Date(itemObj.auctionEndsAt).toUTCString()
        }

        if (itemObj.currentBid == '') delete itemObj.currentBid;

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
// --- items list based on user bidding history ---
export const itemsByUserBids = async (user) => {

    try {
        // [...new Set(data.map(item => item.Group))]
        const bids = await getBidsByUserId(user._id)
        console.log(bids);
        let items = []
        for (let b in bids) {
            const bid = bids[b]
            const item = await getItemById(bid.itemId, user)
            items.push(item)
        }
        return items;
    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }

}


// ============= Bid Area =============


export const performBid = async (itemId, bidAmount, user) => {

    try {

        if (user.role !== "REG") return Promise.reject("Unauthorized to bid");

        // get current item
        const item = await getById(itemId);

        console.log(itemId, bidAmount, user.userId);

        // perform checks
        if (!item) return Promise.reject({ msg: "cant find item" });

        if (new Date().getTime() >= new Date(item.auctionEndsAt).getTime()) return Promise.reject({ msg: "time already ellapsed" });

        // if (new Date().toUTCString() >= new Date(item.auctionEndsAt).toUTCString()) return Promise.reject({ msg: "time already ellapsed" });

        let currentBidObj = { bidPrice: 0.0 };
        if (item?.currentBid) {
            const res = await getBidById(item.currentBid)
            if (res) currentBidObj = res
        }

        if (user._id.equals(currentBidObj?.userId)) return ({ msg: "You already have higher bid", status: true });

        if (bidAmount <= Math.max(parseInt(item.basePrice), currentBidObj.bidPrice)) return Promise.reject("your bid is less then current bid")

        // perform bid
        let newbid = await createBid(item._id, user._id, bidAmount)
        const result = await update(itemId, { currentBid: newbid._id }, true)
        return result;

    } catch (error) {
        const { message } = error;
        return Promise.reject(message)
    }
}

export const getBidsByItemId = async (itemId) => {

    try {
        const bids = await getBidsForItem(itemId);
        let result = [];
        if (bids.length) {
            for (let b in bids) {
                const bid = bids[b]
                const user = await getUserById(bid.userId)
                result.push({
                    _id: bid._id,
                    bidPrice: bid.bidPrice,
                    createdAt: bid.createdAt,
                    userId: user.userId,
                    userName: user.userName
                })
            }
        }
        result.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
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