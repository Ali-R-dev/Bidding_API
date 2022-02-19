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
    const result = await BidderBot.findOne({ userId: userId }).exec()
    return result;
}

export const getActiveBots = async () => {
    return await BidderBot.findById({ ItemIdsForAutoBid: { $exists: true, $ne: [] } })
}
export const updateBot = async (userId, bot) => {
    const result = await BidderBot.updateOne({ userId: userId }, { $set: bot }, {
        new: true
    });
    console.log(result);
    return result;
}
export const delBot = async (id) => {
    return await BidderBot.deleteOne({ _id: id })
}