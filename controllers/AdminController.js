import Item from '../models/Item'
import { create, get } from '../services/adminService'

export const createItem = (req, res) => {

    create(req.body).then(
        onResolve => {
            return res.status(201).json(onResolve)
        },
        onReject => {
            console.log(onReject)
            return res.status(400).send("Cannot save the record")
        }
    )

}

export const getItems = (req, res) => {

    get().then(
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
    const item = Item.find({ id: id });
    if (item) return res.json(item);
    return res.send({})
}

export const update = () => {

}

export const del = () => {

}