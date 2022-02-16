import Bid from '../models/bid'

export const createBid = async ({ price, userId, itemId }) => {

    var bids = new Bid({
        price: price,
        userId: userId,
        itemId: itemId
    })
    const result = await bids.save();
    return result;
}

export const getBid = async () => {

    const result = await Bid.find({})
    return result;

}

export const getBidById = async (id) => {

    const result = await Bid.findById(id)
    return result;
}

export const updateBid = async (id, bid) => {

    const result = await Bid.findOneAndUpdate({ _id: id }, bid, {
        new: true
    });
    return result;
}

export const delBid = async (id) => {

    const result = await Bid.deleteOne({ _id: id })
    return result;
}