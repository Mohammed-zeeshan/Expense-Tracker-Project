const SignUp = require('../models/signup');

exports.getsignup = (req, res, next) => {
    res.render('signup');
}

exports.postsignup = (req, res, next) => {
    const signup = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    SignUp.create(signup).then((exp) => {
        console.log(exp);
        res.redirect('/addsignup');
    }).catch((err) => {
        console.log(err);
    })
}

exports.getpostsignup = (req, res, next) => {
    SignUp.findAll().then((users) => {
        console.log(users);
    }).catch((err) => {
        console.log(err);
    });
}
