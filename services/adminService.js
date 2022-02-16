import Item from '../models/Item'

export const create = async ({ name, Description, adminId }) => {

    var item = new Item({
        Name: name,
        Description: Description,
        expiry: Date.now(),
        adminId: adminId,
    })
    const result = await item.save();
    return result;

}
export const get = async () => {
    const items = await Item.find({})
    return items;
}