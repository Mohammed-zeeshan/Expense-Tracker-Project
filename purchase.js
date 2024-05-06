const Razorpay = require('razorpay');
const Order = require('../models/order');

exports.purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order_id, status: 'PENDING'}).then(() => {
                return res.status(201).json({order, key_id: rzp.key_id});
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch (err) {
        console.log(err);
        res.status(401).json({message: 'Something went wrong', error: err})
    }
}

exports.updateTransactionStatus = (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        Order.findOne({where: {orderid: order_id}}).then(order => {
            order.update({paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                return res.status(202).json({success: true, message: 'Transaction Successful'});
            }).catch((err) => {
                throw new Error(err);
            })
        }).catch((err) => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
    }
}
