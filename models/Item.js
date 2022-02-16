import mongoose from "mongoose";
const { Schema } = mongoose;
const ItemSchema = new Schema({
    name: String,
    description: String,
    expiry: Date,
    adminId: String,
});
export default mongoose.model("Item", ItemSchema);