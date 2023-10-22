const crypto = require('crypto');

const bcrypt = require('bcryptjs'); // It help us to working with passwords encrypt
const nodemailer = require('nodemailer');
const { parsed: {USER_EMAIL_SERVER, PASS_EMAIL_SERVER} } = require('dotenv').config();
const { validationResult } = require('express-validator/check');

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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then(user => {

      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
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
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'The password you type is invalid.',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [{param: 'password'}],
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect('/login');
      })

      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });;
  }

   bcrypt.hash(password, 12)
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
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {

  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (erro, buffer) => {
    if (erro) {
      console.log('Erro ao gerar o token <-----');
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        console.log('Não achou user com esse email <---')
        req.flash('error', 'No account with that email found.')
        return res.redirect('/reset');
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save()
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: `Lucas <${USER_EMAIL_SERVER}>`,
          subject: 'Password Reset',
          html: `
            <p>You requested a pessword reset.</p>
            <p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
    })
    .catch(err => console.log(err))
  })
}

exports.getNewPassword = (req, res, next) => {

  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
  .then(user => {
    
  let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    })
  })
  .catch(err => console.log(err));

}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({ resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId })
   .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
   })
   .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
   })
   .then(result => {
      return res.redirect('/login');
   })
   .catch(errr => console.log(err));


}