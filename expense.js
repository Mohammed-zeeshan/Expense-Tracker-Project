const Expense = require("../models/expense");
const Download = require("../models/download");
const sequelize = require("../util/database");
const UserServices = require("../services/userservices");
const S3services = require("../services/S3services");

exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const signupId = req.user.id;
  await Expense.create(
    { amount, description, category, signupId },
    { transaction: t }
  )
    .then((expense) => {
      const totalExpense = Number(req.user.totalExpense) + Number(amount);
      req.user
        .update({ totalExpense: totalExpense }, { transaction: t })
        .then(async () => {
          await t.commit();
          return res.status(201).json({ expense, message: "Expense added" });
        })
        .catch(async (err) => {
          await t.rollback();
          console.log(err);
        });
    })
    .catch(async (err) => {
      await t.rollback();
      console.log(err);
    });
};

exports.getExpense = async (req, res, next) => {
  try {
    const Items_per_page = 2;
    const page = req.query.page;
    await Expense.count({ where: { signupId: req.user.id }}).then((total) => {
      totalItems = total;
    })
    return Expense.findAll({ where: { signupId: req.user.id }, 
      offset: (page - 1) * Items_per_page,
      limit: Items_per_page,
    }).then((data) => {
      res.status(201).json({
        products: data,
        currentPage: page,
        hasNextPage: Items_per_page * page < totalItems,
        nextPage: Number(page) + Number(1),
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / Items_per_page),
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const id = req.body.id;
    const amount = req.body.amount;
    Expense.destroy(
      { where: { id: id, signupId: req.user.id } },
      { transaction: t }
    )
      .then(() => {
        const totalExpense = Number(req.user.totalExpense - Number(amount));
        req.user
          .update({ totalExpense: totalExpense }, { transaction: t })
          .then(async () => {
            await t.commit();
            res.status(201).json({ message: "Success" });
          })
          .catch(async () => {
            await t.rollback();
            console.log(err);
          });
      })
      .catch(async () => {
        await t.rollback();
        console.log(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.downloadexpense = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await S3services.uploadToS3(stringifiedExpenses, filename);
    Download.create({ link: fileUrl, fileName: filename, signupId: userId });
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    res.status(500).json({ fileUrl: "", success: false, err: err });
    console.log(err);
  }
};

exports.getdownload = async (req, res, next) => {
  try {
    const data = await Download.findAll({ where: { signupId: req.user.id } });
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
  }
};
