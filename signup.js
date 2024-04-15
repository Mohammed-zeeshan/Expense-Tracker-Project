const SignUp = require("../models/signup");
const bcrypt = require('bcrypt');

function stringValidator(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.postsignup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (
      stringValidator(name) ||
      stringValidator(email) ||
      stringValidator(password)
    ) {
      return res.json({ message: "Something is missing" });
    } 
    await SignUp.findAll({where: {email: email}}).then((data) => {
      if (data.length === 1) {
        res.status(201).json({message: "User already exist"});
      }
        await SignUp.create({name, email, password: hash})
          res.status(201).json({message: "New user Created"});
    })
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.postlogin = async (req, res, next) => {
  const password = req.body.password;
    await SignUp.findAll({where: {email: req.body.email}}).then((data) => {
      if (data.length === 0) {
        return res.status(201).json({success: false, message: "User not found"});
      }
      if (password === data[0].password) {
        if (!err){
          res.status(201).json({success: true, message: "User login successful"});
        } else {
          return res.status(201).json({success: false, message: "User not authorized"});
        }
      }
    }).catch((err) => {
      console.log(err);
    })
};
