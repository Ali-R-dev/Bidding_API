import mongoose from "mongoose";
const { Schema } = mongoose;
const ItemSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'Name is mandatory']
    },
    description: {
        type: String,
        trim: true
    },
    auctionEndsAt: {
        type: Date,
        required: [true, 'auction expiry is mandatory']
    },
    isSoled: {
        type: Boolean,
        default: false
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is mandatory']
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'AdminId is mandatory']
    },
    currentBid: {
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    }
});
export default mongoose.model("Item", ItemSchema);