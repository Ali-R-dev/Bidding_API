
import app from 'express'
import {
    fetchItemsList,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    performBid,
    getBidsByItemId,
    itemsByUserBids,
    toogleAutobid,
    updateAutoBot,
    getAutoBotByUserId,
    getInvoiceByItemId
} from '../services/commonServices'

// ---create an item---
export const create = (req, res) => {

    createItem(req.body, req.user).then(
        onResolve => {
            return res.status(201).json(onResolve)
        },
        onReject => {
            console.log(onReject)
            return res.status(400).send("Cannot save the record")
        }
    )
}
// ---get an item---
export const get = (req, res) => {

    fetchItemsList(req.user, req.query).then(
        onResolve => {
            return res.status(200).json(onResolve)
        },
        onReject => {
            return res.status(400).send("No record found")
        }
    )
}
// --get item by id---
export const getById = (req, res) => {

    const { id } = req.params;
    getItemById(id, req.user).then(
        resolve => {
            console.log(resolve);
            return res.status(200).json(resolve)
        },
        reject => {
            console.log(reject);
            return res.status(404).json(reject)
        })
}
// ---update---
export const update = (req, res) => {

    const { id } = req.params;
    updateItem(id, req.body, req.user).then(
        resolve => {
            console.log(resolve);
            return res.status(200).json(resolve)
        },
        reject => {
            console.log(reject);
            return res.status(400).json(reject)
        })
}
// ---Delete an item----
export const del = (req, res) => {
    const { id } = req.params;
    deleteItem(id, req.user).then(
        resolve => {
            if (resolve.deletedCount > 0) return res.status(200).json(resolve)
            return res.status(400).json(resolve)
        },
        reject => {
            return res.status(400).json(reject)
        })
}
// --- get All items whome regular user bid ---
export const getItemsByUserbids = async (req, res) => {

    itemsByUserBids(req.user).then(

        resolve => {
            return res.status(200).json(resolve)
        },

        reject => {
            return res.status(400).send(reject)
        })
}

// ======== Bidding Area ========

// --- bid request on item---
export const newBid = async (req, res) => {

    const { id: itemId } = req.params
    const { bidAmount } = req.body

    performBid(itemId, bidAmount, req.user).then(

        resolve => {
            if (resolve.status) return res.status(400).send(resolve)
            
            return res.status(200).json(resolve)
        },
        reject => {
            console.log("rejected", reject)
            return res.status(400).send(reject)
        }
    )
}

export const getBids = async (req, res) => {

    const { id: itemId } = req.params

    getBidsByItemId(itemId).then(
        resolve => {
            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send(reject)
        })
}

// =================BOT AREA==================

export const toogleAutoBidStatus = (req, res) => {
    const { id: itemId } = req.params
    const { setStatus } = req.body
    toogleAutobid(itemId, setStatus, req.user).then(

        resolve => {
            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send(reject)
        })
}
export const updateBot = async (req, res) => {

    // const { maxBalance, notifyAt } = req.body
    updateAutoBot(req.user, req.body).then(
        resolve => {

            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send("No record found")
        })
}

export const getbotByUserId = async (req, res) => {

    getAutoBotByUserId(req.user).then(
        resolve => {
            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send(reject)
        })
}
export const getInvoice = async (req, res) => {
    const { id: itemId } = req.params
    getInvoiceByItemId(itemId, req.user).then(
        resolve => {
            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send(reject)
        })
}
