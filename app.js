const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./util/database').mongoConnect;

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const notFoundController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('65187e2291546681a1d33fee')
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {
        console.log(err);
    });
})

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(notFoundController.get404);

mongoConnect(() => {
    app.listen(4000);
})


