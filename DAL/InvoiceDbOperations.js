
import Invoice from '../models/invoice'

export const getInvoice = async (filter) => {

    const res = await Invoice.findOne(filter)
    return res;

}
export const getInvoiceByUser = async (userId) => {

    const res = await Invoice.findOne({
        userId: userId
    })
    console.log(res, userId);
    return res;
}
export const getInvoiceByItem = async (itemId) => {

    const res = await Invoice.findOne({
        itemId: itemId
    })
    console.log(res);
    return res;
}
export const saveInvoice = async (inv) => {
    let newInvoice = new Invoice(inv)
    const res = await newInvoice.save();
    return res
}