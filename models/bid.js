import mongoose from "mongoose";
const { Schema } = mongoose;
const BidSchema = new Schema({

    bidPrice: {
        type: Number,
        required: [true, 'bid Price is mandatory']
    },
    createdAt: {
        type: Date,
        required: [true, 'createdAt is mandatory']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'user Id is mandatory'],
        ref: 'User'
    },
    itemId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Item Id is mandatory'],
        ref: 'Item'
    },

});
export default mongoose.model("Bid", BidSchema);