const SignUp = require('../models/signup');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.showleaderboard = async (req, res, next) => {
    try {
        const users = await SignUp.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('amount')), 'totalAmount']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['signup.id'],
            order: [['totalAmount', 'DESC']]
        });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}
