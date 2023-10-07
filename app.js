const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const notFoundController = require('./controllers/error');

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://lucasschmidt015:eHhMQePUAzCeWbzU@cluster0.nq2w9zx.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({ 
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {

    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(notFoundController.get404);

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(4000);
})
.catch(err => console.log(err));


