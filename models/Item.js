import mongoose from "mongoose";
const { Schema } = mongoose;
const ItemSchema = new Schema({
    Id: String,
    Name: String,
    Description: String,
    expiry: Date,
    adminId: String,
});
export default mongoose.model("Item", ItemSchema);