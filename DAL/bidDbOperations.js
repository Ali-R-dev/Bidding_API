import Bid from '../models/bid'

export const getBidsForItem = async (itemId) => {

    const res = await Bid.find({
        itemId: itemId
    })
    return res;
}

export const getBidById = async (bidId) => {

    const res = await Bid.findOne({ _id: bidId })
    return res;
}

export const getBidsByUserId = async (userId) => {

    const res = await Bid.find({ userId: userId });
    return res;
}

export const createBid = async (itemId, userId, bidPrice) => {

    let newBid = new Bid({
        bidPrice: bidPrice,
        userId: userId,
        itemId: itemId,
        createdAt: new Date().toUTCString()
    })
    let res = await newBid.save();
    return res;
}