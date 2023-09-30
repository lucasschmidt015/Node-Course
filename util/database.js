const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://lucasschmidt015:eHhMQePUAzCeWbzU@cluster0.nq2w9zx.mongodb.net/shop?retryWrites=true&w=majority')
    .then(Client => {
        console.log('Connected!');
        _db = Client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;