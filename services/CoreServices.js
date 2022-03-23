import Mongoose from 'mongoose';
import { getActiveBots, updateBotByUserId } from '../DAL/biderBotDbOperations';
import { getById as getItemById, get as getItems, update as updateItem } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid, updateAutoBot } from './commonServices'
import { getUser } from '../DAL/userDbOperations'
import { getBidById } from '../DAL/bidDbOperations'
import easyinvoice from 'easyinvoice';
import fs from 'fs'
const ItemSoldingProcess = async () => {

    const Items = await getItems({
        auctionEndsAt: { $lt: new Date().toISOString() }
    })

    for (let i in Items) {

        if (Items[i].currentBid) {
            await updateItem(Items[i]._id, { isSoled: true }, true)
        }
    }
}
const createInvoice = (item, user, bid) => {
    const getDate = () => {
        let dt = new Date();
        const dateNow = dt.toISOString().split('T')[0].split('-').reverse().join('-');
        dt = dt.setDate(dt.getDate() + 15);
        const dateEnd = dt.toISOString().split('T')[0].split('-').reverse().join('-');
        return [dateNow, dateEnd]
    }
    // item.name.split(' ').join('_');
    // const InvoiceCode ="userId+ +getDate()[0]";



    const data = {
        "images": {
            "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf"
        },
        "sender": {
            "company": "Bidding Corp",
            "address": "Sample Street 123",
            "zip": "1234 AB",
            "city": "Sampletown",
            "country": "Samplecountry"
        },
        "client": {
            "company": user.userName,
            "address": "Clientstreet 456",
            "zip": "4567 CD",
            "city": "Clientcity",
            "country": "Clientcountry"
        },
        "information": {
            "number": "2022.0001",
            "date": getDate()[0],
            "due-date": getDate()[1]
        },
        "products": [
            {
                "quantity": "1",
                "description": item.name,
                "tax-rate": 0,
                "price": bid.bidPrice
            }
        ],
        "bottom-notice": "Kindly pay your invoice within 15 days.",
        "settings": {
            "currency": "USD",
            "tax-notation": "vat",
            "margin-top": 50,
            "margin-right": 50,
            "margin-left": 50,
            "margin-bottom": 25
        }
    }

    easyinvoice.createInvoice(data, function (result) {

        console.log('PDF base64 string: ', result.pdf);
        fs.writeFileSync("invoice.pdf", pdf, 'base64');
    });
}
const createEmailNotification = (item) => {


}

export const RunCoreServices = async () => {

    let lock = false;
    setInterval(async () => {
        console.log("--start interval--");
        if (lock == false) {
            lock == true
            console.log("-start Bot-");
            await ItemSoldingProcess()
            console.log("-end bot-");
            lock = false
        }
        console.log("--end interval--");
    }, 2000);
}