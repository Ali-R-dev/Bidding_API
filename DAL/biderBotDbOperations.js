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
    let result = await BidderBot.findOne({ userId: userId })
    if (result == null) {
        result = await createBot({
            userId,
            maxBalance: 50,
            notifyAt: 90,
            ItemIdsForAutoBid: []
        }
        )
    }
    return result;
}

export const getActiveBots = async () => {
    const result = await BidderBot.find({ ItemIdsForAutoBid: { $ne: [] } })
    return result;
}

export const updateBot = async (id, bot) => {
    const result = await BidderBot.updateOne({ _id: id }, { $set: bot }, {
        new: true
    });

    return result;
}

export const updateBotByUserId = async (userId, bot) => {
    const result = await BidderBot.updateOne({ userId: userId }, { $set: bot }, {
        new: true
    });

    return result;
}

export const delBot = async (id) => {
    return await BidderBot.deleteOne({ _id: id })
}