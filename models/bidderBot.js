import mongoose from "mongoose";
const { Schema } = mongoose;
const BidderBotSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'bidderId is mandatory']
    },
    maxBalance: Number,
    notifyAt: Number,
    ItemIdsForAutoBid: Array
});
export default mongoose.model("BidderBot", BidderBotSchema);