import Item from '../models/Item'
const create = (req, res) => {
    const { name, Description, adminId } = req.body;
    var item = new Item({
        Name: name,
        Description: Description,
        expiry: Date.now(),
        adminId: adminId,
    })
    item.save((err, item) => {
        if (err) return res.send(err);
        return res.json(item);
    })
}
const get = async (req, res) => {
    const items = await Item.find({})
    return res.send(items)
}
const getById = (req, res) => {
    const { id } = req.params;
    const item = Item.find({ id: id });
    if (item) return res.json(item);
    return res.send({})
}
const update = () => {

}
const del = () => {

}
export { create, get, getById, update, del }