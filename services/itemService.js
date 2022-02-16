import Item from '../models/Item'

export const createItem = async ({ name, Description, adminId }) => {

    var item = new Item({
        name: name,
        description: Description,
        expiry: Date.now(),
        adminId: adminId,
    })
    const result = await item.save();
    return result;

}
export const getItem = async () => {
    const result = await Item.find({})
    return result;
}
export const getItemById = async (id) => {
    const result = await Item.findById(id)
    return result;
}
export const updateItem = async (id, item) => {

    const result = await Item.findOneAndUpdate({ _id: id }, item, {
        new: true
    });
    return result;
}

export const delItem = async (id) => {
    const result = await Item.deleteOne({ _id: id })
    return result;
}