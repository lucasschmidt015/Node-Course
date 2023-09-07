const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Cart = require('./models/cart');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const notFoundController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(notFoundController.get404);

app.listen(4000);