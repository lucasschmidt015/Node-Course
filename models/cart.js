const db = require('../util/database');
const Product = require('./product');

module.exports = class Cart {

    static addProduct(id, productPrice) {
        return db.execute('SELECT * FROM my_cart')
        .then(([MyCart]) => {
            if (MyCart) {
                const products = JSON.parse(MyCart[0].products);
                
                const total_price = MyCart[0].total_price;
                const productIndex = products.findIndex(prod => prod.id === id);
                
                if (productIndex != -1) { // It means that the product already exists
                
                    products[productIndex].qty = products[productIndex].qty + 1;

                    return db.execute(`UPDATE my_cart set products = '${JSON.stringify(products)}', total_price = ${MyCart[0].total_price + productPrice}`)
                    
                } else { 
                    const newProduct = {id: id, qty: 1};
                    products.push(newProduct);

                    const new_total = total_price + productPrice;

                    return db.execute(`UPDATE my_cart SET products = '${JSON.stringify(products)}', total_price = ${new_total}`)
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    static deleteProduct(id, productPrice) {

        return this.getCart()
        .then(([myCart]) => {
            const Cart = JSON.parse(myCart[0].products);
            const product = Cart.find(prod => prod.id === id);

            if (!product) {
                return;
            }

            const productQty = product.qty;
            const updatedCart = Cart.filter(Crt => Crt.id !== id);
            const total_price = myCart[0].total_price - productPrice * productQty

            return db.execute(`UPDATE my_cart SET products = '${JSON.stringify(updatedCart)}', total_price = ${total_price}`)
        })
        .catch(err => {
            console.log(err);
        })
    }

    static getCart() {
        return db.execute('SELECT * FROM my_cart');
    }
}