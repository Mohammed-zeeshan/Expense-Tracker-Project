const Expense = require("../models/expense");

exports.postExpense = async (req, res, next) => {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const signupId = req.user.id;
        await Expense.create({amount, description, category, signupId}).then(expense => {
            return res.status(201).json({expense, message: 'Expense added'});
        }).catch(err => console.log(err));
}

exports.getExpense = async (req, res, next) => {
    try{
        await Expense.findAll({where: {signupId: req.user.id}}).then((data) => {
            res.status(201).json(data);
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try{
        const id = req.body.id;
        Expense.destroy({where: {id: id, signupId: req.user.id}})
        res.status(201).json({message: "Success"})
    } catch (err) {
        res.status(500).json(err);
    }
}
