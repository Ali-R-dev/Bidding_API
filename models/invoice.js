import { type } from "express/lib/response";
import mongoose from "mongoose";
const { Schema } = mongoose;
const InvoiceSchema = new Schema({

    invoiceCode: {
        type: String,
        required: [true, 'invoiceCode is mandatory'],
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
    createdAt: {
        type: Date,
        required: [true, 'createdAt is mandatory']
    },
    note: String


});
export default mongoose.model("Invoice", InvoiceSchema);