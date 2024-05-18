const Sib = require('sib-api-v3-sdk');

require('dotenv').config();

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_KEY;

exports.forgotpassword = async (req, res, next) => {
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'mohammedzeeshan440@gmail.com',
        name: 'Expense Tracker'
    }

    const recievers = [
        {
            email: req.body.email,
        }
    ]
    tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: 'Reset password',
        textContent: 'Now you can reset your password'
    }).then((email) => {
        console.log(email)
    }).catch((err) => {
        console.log(err);
    })
    return res.status(201).json("success");
}
