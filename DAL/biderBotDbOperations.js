import BidderBot from '../models/bidderBot'

export const createBot = async (bot) => {
    let newBot = new BidderBot(bot);
    return await newBot.save();
}

export const getBots = async () => {
    const result = await BidderBot.find({})
    return result

}

export const getBotById = async (id) => {
    return await BidderBot.findById(id)
}

export const getBotByUserId = async (userId) => {
    const result = await BidderBot.findOne({ userId })
    return result;
}

export const getActiveBots = async () => {
    const result = await BidderBot.find({ ItemIdsForAutoBid: { $ne: [] } })
    console.log(result);
    return result;
}

export const updateBot = async (id, bot) => {
    console.log(bot);
    const result = await BidderBot.updateOne({ _id: id }, { $set: bot }, {
        new: true
    });
    return result;
}

export const delBot = async (id) => {
    return await BidderBot.deleteOne({ _id: id })
}