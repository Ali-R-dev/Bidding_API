
import fs from 'fs'
import { getBotById, getBotByUserId, getBots, updateBot, updateBotByUserId } from '../DAL/biderBotDbOperations';

import {
    create,
    get,
    getById,
    update,
    del
} from '../DAL/itemDbOperations'
import { getInvoiceByItem } from '../DAL/InvoiceDbOperations'

import { getUserById } from './userService';

import { createBid, getBidById, getBidsForItem, getBidsByUserId } from '../DAL/bidDbOperations'
import { getIo } from './MySocketIo'

export const fetchItemsList = async (user, query) => {

    try {
        const { page, search } = query
        let result = [];
        // --- filtration ---

        let filterQuery = {};
        if (search != undefined) {

            filterQuery = {
                $or: [
                    { name: { $regex: new RegExp(search, "i") } },
                    { description: { $regex: new RegExp(search, "i") } }
                ]
            }
        }

        if (user.role === 'ADM') {
            result = await (await get(filterQuery)).filter(item => user._id.equals(item.adminId));
        }
        else {
            result = await get(filterQuery);
        }

        for (let i in result) {


            const currentbid = await getBidById(result[i].currentBid)
            result[i].currentBid = currentbid

        }
        // 
        result.sort((a, b) => {
            return (b?.currentBid?.bidPrice || b.basePrice) - (a?.currentBid?.bidPrice || a.basePrice)
        }
        )
        // 

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

    const Item = await getById(id);
    // ---validation---
    if (Item && user.role === 'ADM' && !user._id.equals(Item.adminId)) {
        return Promise.reject({ msg: "Unauthorized to access" })
    }

    if (user.role == 'REG') {
        const bot = await getBotByUserId(user._id)
        let result = {
            name: Item.name,
            _id: Item._id,
            description: Item.description,
            auctionEndsAt: Item.auctionEndsAt,
            isSoled: Item.isSoled,
            basePrice: Item.basePrice,
            adminId: Item.adminId,
            currentBid: Item.currentBid,
            botActive: false
        }
        if (bot?.ItemIdsForAutoBid?.find(x => Item._id.equals(x))) {
            result.botActive = true
            return result
        } else return result
    }

    return Item;
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
        console.log(error);
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

        if (item.currentBid) return Promise.reject({ msg: "Can not delete,in bidding process" })

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

        const bids = await (await getBidsByUserId(user._id)).sort((a, b) => {
            return b.bidPrice - a.bidPrice
        })
        // 
        const ItemKeys = [... new Set(bids.map((b) => String(b.itemId)))]

        let res = []
        for (let i in ItemKeys) {
            const itmKey = ItemKeys[i]
            const item = await getItemById(itmKey, user)
            const currentBid = await getBidById(item.currentBid)
            res.push({
                _id: item._id, name: item.name, isSoled: item.isSoled, currentBid: currentBid, bids: []
            })
        }
        for (let b in bids) {

            const n = res.findIndex(i => String(bids[b].itemId) == String(i._id))
            res[n].bids.push(bids[b])
        }
        res.sort((a, b) => {
            return new Date(b.currentBid.createdAt).getTime() - new Date(a.currentBid.createdAt).getTime()
        })

        return res;
    } catch (error) {
        const { message } = error
        console.log(error);
        return Promise.reject({ msg: message })
    }
}

// ============= Bid Area =============

export const performBid = async (itemId, bidAmount, user) => {

    try {
        
        if (user.role !== "REG") return Promise.reject("Unauthorized to bid");
        // get current item
        const item = await getById(itemId);
        // perform checks
        if (!item) return Promise.reject({ msg: "cant find item" });

        if (new Date().getTime() >= new Date(item.auctionEndsAt).getTime()) return Promise.reject({ msg: "time already ellapsed" });

        let currentBidObj = { bidPrice: 0.0 };
        if (item?.currentBid) {
            const res = await getBidById(item.currentBid)
            if (res) currentBidObj = res
        }
        console.log(user._id, currentBidObj?.userId);
        if (String(user._id) == String(currentBidObj?.userId)) return ({ msg: "You already have higher bid", status: true });

        if (bidAmount <= Math.max(parseInt(item.basePrice), currentBidObj.bidPrice)) return Promise.reject("your bid is less then current bid")

        // perform bid
        let newbid = await createBid(item._id, user._id, bidAmount)
        const result = await update(itemId, { currentBid: newbid._id }, true)
        getIo().to(itemId).emit("updatedData")
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
            result.sort((a, b) => {
                return b.bidPrice - a.bidPrice;
            })
        }

        return result;

    } catch (error) {
        const { message } = error;
        return Promise.reject(message)
    }
}
// ======INVOICE=======

export const getInvoiceByItemId = async (itemId, user) => {

    try {
        const invoiceObj = await getInvoiceByItem(itemId);

        if (!invoiceObj) Promise.reject({ msg: "Not Found" })

        if (user.role === 'ADM' || !invoiceObj.userId.equals(user._id)) Promise.reject({ msg: "unauthorized" })

        return invoiceObj
    } catch (error) {
        const { message } = error;
        return Promise.reject(message)
    }

}

// ============= BOT AREA =============

export const toogleAutobid = async (itemId, setStatus, user) => {

    // validation check
    if (user.role !== "REG") return Promise.reject("Unauthorized")
    // get bot
    let bot = await getBotByUserId(user._id)
    if (!bot) return Promise.reject("Cant find bot for this user")

    // return Promise.reject("Cant find bot for this user")
    let { ItemIdsForAutoBid: itemKeys } = bot;
    // changings
    const index = itemKeys.indexOf(itemId);
    if (setStatus === "DEACT") {
        if (index === -1) return;
        itemKeys.splice(index, 1)
    }
    if (setStatus === "ACT") {
        if (index != -1) return;
        itemKeys.push(itemId)
    }
    // update bot
    const result = await updateBot(bot._id, { ...bot, ItemIdsForAutoBid: [...itemKeys] })

    getIo().to(itemId).emit("updatedData")


    return result;
}

export const getAllAutoBots = async () => {
    const result = await getBots();
    return result;
}
export const getAutoBotByUserId = async (user) => {
    const result = await getBotByUserId(user._id)
    return result;
}
export const updateAutoBot = async (user, bot) => {
    const result = await updateBotByUserId(user._id, bot)
    return result;
}
// export const getAutoAlert = async (userId) => {

//     const bot = await getBotByUserId(userId)
//     let amount = 0;

//     for (const i in ItemIdsForAutoBid) {

//         const itemId = ItemIdsForAutoBid[i];

//         const item = await getItemById(itemId);

//         if (newBidPrice + amount > bot.maxBalance) {
//             return true
//         }

//     }

//     const percent = (amount / bot.maxBalance) * 100;
//     if (bot.notifyAt <= percent) return true
//     return false
// }

