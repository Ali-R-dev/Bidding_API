import {
    createItem,
    getItem,
    getItemById,
    updateItem,
    delItem
} from '../services/itemService'


export const create = (req, res) => {

    createItem(req.body).then(
        onResolve => {
            return res.status(201).json(onResolve)
        },
        onReject => {
            console.log(onReject)
            return res.status(400).send("Cannot save the record")
        }
    )

}

export const get = (req, res) => {

    getItem().then(
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

export const update = (req, res) => {
    const { id } = req.params;

    updateItem(id, req.body).then(
        resolve => {
            return res.status(200).json(resolve)
        },
        reject => {
            return res.status(400).send("Cannot update")
        }
    )
}

export const del = (req, res) => {
    const { id } = req.params;
    delItem(id).then(
        resolve => {
            if (resolve.deletedCount > 0) return res.status(200).json(resolve)
            return res.status(400).send("No record deleted")
        },
        reject => {
            return res.status(400).send("Cannot delete")
        }
    )

}