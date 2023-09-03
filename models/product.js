const Cart = require('./cart');
const db = require('../util/database');

//https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {

        if (this.id) {
            return db.execute(`UPDATE products set title = '${this.title}', imageUrl = '${this.imageUrl}', description = '${this.description}', price = ${this.price} WHERE id = ${this.id}`);
        } else {
            return db.execute(
                'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', 
                [this.title, this.price, this.imageUrl, this.description]
            );
        }
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute(`SELECT * FROM products WHERE id = ${id}`);
    }

    static deleteById(id) {
        return db.execute(`DELETE FROM products WHERE id = ${id}`);
    }
}