import mongoose from "mongoose";
const { Schema } = mongoose;
const BidSchema = new Schema({
    price: String,
    userId: String,
    itemId: String,
});
export default mongoose.model("Bid", BidSchema);