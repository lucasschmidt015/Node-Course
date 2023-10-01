const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

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
    User.findById('6519ca762896bbba96622e49')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
})

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(notFoundController.get404);

mongoose.connect('mongodb+srv://lucasschmidt015:eHhMQePUAzCeWbzU@cluster0.nq2w9zx.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    User.findOne().then(user => {
        if (!user) {
            const newUser = new User({ 
                name: 'Lucas',
                email: 'teste@teste.com',
                cart: {
                    items: []
                }
             });
             newUser.save();
        }
    })
    
    app.listen(4000);
})
.catch(err => console.log(err));


