const Expense = require("../models/expense");
const sequelize = require('../util/database');

exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const signupId = req.user.id;
    await Expense.create({amount, description, category, signupId}, {transaction: t}).then(expense => {
        const totalExpense = Number(req.user.totalExpense) + Number(amount)
        req.user.update({totalExpense: totalExpense}, {transaction: t}).then(async() => {
            await t.commit();
            return res.status(201).json({expense, message: 'Expense added'});
        }).catch(async(err) => {
            await t.rollback();
            console.log(err)
        });
    }).catch(async(err) => {
        await t.rollback();
        console.log(err)
    });
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
        const t = await sequelize.transaction();
        const id = req.body.id;
        const amount = req.body.amount;
        Expense.destroy({where: {id: id, signupId: req.user.id}}, {transaction: t}).then(() => {
            const totalExpense = Number(req.user.totalExpense - Number(amount));
            req.user.update({totalExpense: totalExpense}, {transaction: t}).then(async() => {
                await t.commit();
                res.status(201).json({message: "Success"})
            }).catch(async() => {
                await t.rollback();
                console.log(err);
            })
        }).catch(async() => {
            await t.rollback();
            console.log(err);
        })
    } catch (err) {
        res.status(500).json(err);
    }
}
