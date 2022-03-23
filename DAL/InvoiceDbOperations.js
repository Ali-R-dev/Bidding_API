
import Invoice from '../models/invoice'

export const getInvoice = async (filter) => {

    const res = await Invoice.findOne(filter)
    return res;

}
export const getInvoiceByUser = async (userId) => {

    const res = await Invoice.findOne({
        userId: userId
    })
    return res;
}

export const create = async (inv) => {
    let newInvoice = new Invoice({
        ...inv
    })
    const res = await newInvoice.save();
    return res
}