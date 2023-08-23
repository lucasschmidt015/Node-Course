const fs = require('fs');
const path = require('path');


const p = path.join(
path.dirname(process.mainModule.filename), 
'data',
'products.json'
);


const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

//https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png
module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            })
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}