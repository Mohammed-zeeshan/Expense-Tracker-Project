const SignUp = require('../models/signup');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.showleaderboard = async (req, res, next) => {
    try {
        const users = await SignUp.findAll({
            attributes: ['id', 'name']
        });
        const expenses = await Expense.findAll({
            attributes: ['signupId', [sequelize.fn('sum', sequelize.col('expense.amount')), 'totalAmount']],
            group: ['signupID']
        });
        const list = {};
        console.log(expenses)

        // expenses.forEach((expense) => {

        //     if (list[expense.signupId]) {
        //         list[expense.signupId] += expense.amount
        //     }
        //     else {
        //         list[expense.signupId] = expense.amount
        //     }
        // })
        var userLeaderboardDetails = [];
        users.forEach((user) => {
            userLeaderboardDetails.push({ name: user.name, totalExpense: list[user.id] || 0})
        })  
        userLeaderboardDetails.sort((a, b) => b.totalExpense - a.totalExpense)
        res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}
