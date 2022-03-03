import mongoose from "mongoose";
const { Schema } = mongoose;
const BidderBotSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'bidderId is mandatory']
    },
    maxBalance: Number,
    notifyAt: Number,
    ItemIdsForAutoBid: Array,
    notifications: [{
        time: Date,
        typeCode: Number,
        message: String
    }]
});
export default mongoose.model("BidderBot", BidderBotSchema);