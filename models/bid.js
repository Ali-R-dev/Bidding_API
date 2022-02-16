import mongoose from "mongoose";
const { Schema } = mongoose;
const BidSchema = new Schema({
    Id: String,
    Price: String,
    UserId: String,
});
export default mongoose.model("Bid", BidSchema, "Bids");