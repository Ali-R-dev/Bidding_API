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
    isInAuction: Boolean,
    basePrice: {
        type: Number,
        required: [true, 'Base price is mandatory']
    },
    adminId: {
        type: String,
        required: [true, 'AdminId is mandatory']
    },
    currentBid: {
        price: Number,
        bidderId: String,
    }
});
export default mongoose.model("Item", ItemSchema);