import { fetchItemsList, getItemById, performBid, toogleAutobid, getAllAutoBots, getAutoBotByUserId, updateAutoBot } from '../services/commonServices'




export const get = (req, res) => {
    fetchItemsList().then(
        onResolve => {
            return res.status(200).json(onResolve)
        },
        onReject => {
            return res.status(400).send("No record found")
        }
    )
}
export const getById = (req, res) => {
    const { id } = req.params;
    getItemById(id).then(
        resolve => {

            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send("No record found")
        }
    )
}
export const newBid = async (req, res) => {

    const { id: itemId } = req.params
    const { bidAmount, userId } = req.body

    performBid(itemId, bidAmount, userId).then(
        resolve => {
            console.log(resolve)
            return res.status(200).json(resolve)
        },
        reject => {
            console.log("rejected", reject)
            return res.status(400).send(reject)
        }
    )
}

// --- bot area ---//

export const getAllBots = async (req, res) => {
    getAllAutoBots().then(
        resolve => {
            console.log(resolve)
            return res.status(200).json(resolve)
        },
        reject => {
            console.log("rejected", reject)
            return res.status(400).send(reject)
        }
    )
}
export const updateBot = async (req, res) => {
    const { id: userId } = req.params;
    const { maxBalance, notifyAt } = req.body
    console.log("controller");
    updateAutoBot(userId, { maxBalance, notifyAt }).then(
        resolve => {

            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send("No record found")
        }
    )
}

export const getbotByUserId = async (req, res) => {
    const { id } = req.params
    getAutoBotByUserId(id).then(
        resolve => {
            console.log(resolve)
            return res.status(200).json(resolve)
        },
        reject => {
            console.log("rejected", reject)
            return res.status(400).send(reject)
        }
    )
}


export const toogleAutoBidStatus = (req, res) => {
    const { id: itemId } = req.params
    const { userId, status } = req.body
    toogleAutobid(itemId, userId, status)
        .then(
            resolve => {
                console.log(resolve)
                return res.status(200).json(resolve)
            },
            reject => {
                console.log("rejected", reject)
                return res.status(400).send(reject)
            }
        )

}