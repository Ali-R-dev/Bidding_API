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
        type: String,
        required: [true, 'user Id is mandatory']
    },
    itemId: {
        type: String,
        required: [true, 'item Id is mandatory']
    }

});
export default mongoose.model("Bid", BidSchema);