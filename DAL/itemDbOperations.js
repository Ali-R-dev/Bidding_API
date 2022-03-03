
import Item from '../models/Item'


export const create = async (itemObj) => {
    console.log(itemObj);
    var newItem = new Item({ ...itemObj })
    const result = await newItem.save();
    return result;

}

export const get = async (search) => {
    let filterQuery = {};
    if (search != undefined) {
        // filterQuery = { name: { $regex: search } }
        filterQuery = {
            $or: [
                { name: { $regex: search } },
                { description: { $regex: search } }
            ]
        }
    }
    const result = await Item.find(filterQuery).sort({ 'basePrice': 'asc', 'currentBid.price': 'asc' });
    return result;
}

export const getById = async (id) => {
    const result = await Item.findById(id)
    return result;
}

export const update = async (id, item, modify) => {

    try {
        const result = modify ?
            await Item.findOneAndUpdate({ _id: id }, { $set: item }, {
                new: true
            })
            :
            await Item.findOneAndUpdate({ _id: id }, item, {
                new: true
            });
        return result;

    } catch (error) {
        const { message } = error;
        return Promise.reject(message);
    }
}

export const del = async (id) => {
    const result = await Item.deleteOne({ _id: id })
    return result;
}