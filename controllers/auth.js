const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { parsed: {USER_EMAIL_SERVER, PASS_EMAIL_SERVER} } = require('dotenv').config();

const User = require('../models/user');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: USER_EMAIL_SERVER,
    pass: PASS_EMAIL_SERVER,
  }
});


exports.getLogin = (req, res, next) => {

  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {

  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {

      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        req.flash('error', 'The password you type is invalid.')
        res.redirect('/login');
      })
      .catch(err => {
        console.log(errr);
        res.redirect('/login');
      })

      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
  .then(userDoc => {

    if (userDoc) {
      req.flash('error', 'This email has already been registered for another user.')
      return res.redirect('/signup');
    }

    return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
      return user.save();
    })
    .then((result) => {
      return transporter.sendMail({
        to: email,
        from: `Lucas <${USER_EMAIL_SERVER}>`,
        subject: 'Signup succeeded',
        html: '<h1>You successfully signed up!</h1>'
      });
    })
    .then( response => {
      res.redirect('/login');
    })

  })
  .catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
