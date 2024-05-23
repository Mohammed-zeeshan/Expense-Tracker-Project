const Expense = require("../models/expense");
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3services = require('../services/S3services');

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

exports.downloadexpense = async(req, res, next) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3services.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({fileUrl, success: true});
    } catch (err) {
        res.status(500).json({fileUrl: '', success: false, err: err});
        console.log(err);
    }
}
