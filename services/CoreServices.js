import { saveInvoice } from '../DAL/InvoiceDbOperations'
import { getActiveBots, updateBotByUserId } from '../DAL/biderBotDbOperations';
import { getById as getItemById, get as getItems, update as updateItem } from '../DAL/itemDbOperations';
import { performBid, toogleAutobid, updateAutoBot } from './commonServices'
import { getUser } from '../DAL/userDbOperations'
import { getBidById } from '../DAL/bidDbOperations'
import easyinvoice from 'easyinvoice';
import fs from 'fs'
import nodemailer from 'nodemailer';
import { getUserById } from './userService';
export const ItemSoldingProcess = async () => {

    const Items = await getItems({
        auctionEndsAt: { $lt: new Date().toISOString() }
    })

    for (let i in Items) {

        if (Items[i].currentBid && !Items[i].isSoled) {

            const bid = await getBidById(Items[i].currentBid)
            const user = await getUserById(bid.userId)
            await createInvoice(Items[i], user, bid)
            await updateItem(Items[i]._id, { isSoled: true }, true)
        }
    }
}
const createInvoice = async (item, user, bid) => {
    const getDate = () => {
        let dt = new Date();
        const dateNow = dt.toISOString().split('T')[0].split('-').reverse().join('-');
        dt = dt.setDate(dt.getDate() + 15);
        const dateEnd = new Date(dt).toISOString().split('T')[0].split('-').reverse().join('-');

        return [dateNow, dateEnd]
    }

    const invoiceCode = new Date().getTime();
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
            "company": `${user.userName}`,
            "address": "Clientstreet 456",
            "zip": "4567 CD",
            "city": "Clientcity",
            "country": "Clientcountry"
        },
        "information": {
            "number": `${invoiceCode}`,
            "date": `${getDate()[0]}`,
            "due-date": `${getDate()[1]}`
        },
        "products": [
            {
                "quantity": "1",
                "description": `${item.name}`,
                "tax-rate": 0,
                "price": `${bid.bidPrice}`
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

    const pdfInvoice = await easyinvoice.createInvoice(data);

    // await fs.writeFileSync(`Invoice_Docs/${invoiceCode}.pdf`, pdfInvoice.pdf, 'base64');
    const newInv = {
        invoiceCode: invoiceCode,
        userId: user._id,
        itemId: item._id,
        base64String: pdfInvoice.pdf,
        createdAt: new Date().toISOString(),
    };

    const res = await saveInvoice(newInv);

    createEmailNotification({
        invoice: res,
        user: user,
        notification:
        {
            title: "Invoice of Item sold",
            desc: `You have won the bidding for " ${item.name} ".
              The Invoice of Item is Attached. Please Pay it within 15 days to claim the item. Thanks`
        }
    })

    // Now this result can be used to save, download or render your invoice
    // Please review the documentation below on how to do this
    // easyinvoice.createInvoice(data, function (result) {

    //     fs.writeFileSync(invoice.pdf, pdf, 'base64');
    // });
}

export const createEmailNotification = (props) => {
    const { invoice, user, notification } = props

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const mailOptions = {

        from: '',

        // Comma Separated list of mails
        to: user.email,

        // Subject of Email
        subject: notification.title,

        // This would be the text of email body
        text: notification.desc,

        attachments: []

    };
    if (invoice) mailOptions.attachments.push({
        filename: `${invoice.invoiceCode}.pdf`,
        content: invoice.base64String, //EncodedString
        encoding: 'base64'
    })

    transporter.sendMail(mailOptions, function (err, succ) {

        if (err) console.log(err)
        else console.log(succ)

    })


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