import { fetchItemsList, getItemById, performBid, toogleAutobid, getAllAutoBots, getAutoBotByUserId, updateAutoBot, getAutoAlert } from '../services/commonServices'




export const get = (req, res) => {
    fetchItemsList(req.userId, req.userRole, req.query).then(
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
            return res.status(404).send("No record found")
        }
    )
}
export const newBid = async (req, res) => {

    const { id: itemId } = req.params
    const { bidAmount } = req.body

    performBid(itemId, bidAmount, req.userId).then(

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
export const getExceedLimitAlert = async (req, res) => {

    getAutoAlert().then(
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

    const { maxBalance, notifyAt } = req.body
    updateAutoBot(req.userId, { maxBalance, notifyAt }).then(
        resolve => {

            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send("No record found")
        }
    )
}

export const getbotByUserId = async (req, res) => {

    getAutoBotByUserId(req.userId).then(
        resolve => {
            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send(reject)
        }
    )
}

export const toogleAutoBidStatus = (req, res) => {

    const { id: itemId } = req.params
    const { setStatus } = req.body
    console.log(setStatus);
    toogleAutobid(itemId, req.userId, setStatus).then(

        resolve => {
            return res.status(200).json(resolve)
        },

        reject => {
            console.log("rejected", reject)
            return res.status(400).send(reject)
        }
    )

}