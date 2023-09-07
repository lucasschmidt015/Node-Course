const db = require('../util/database');
const Product = require('./product');

module.exports = class Cart {

    static addProduct(id, productPrice) {
        db.execute('SELECT * FROM my_cart')
        .then(([MyCart]) => {
            if (MyCart) {
                const products = JSON.parse(MyCart[0].products);
                console.log(products);
                const total_price = MyCart[0].total_price;
                const productIndex = products.findIndex(prod => prod.id === id);

                console.log(`ProductIndex: ${productIndex}`);
                
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

        // fs.readFile(p, (err, fileContent) => { 
        //     if (err) {
        //         return;
        //     }
        //     const updatedCart = { ...JSON.parse(fileContent) };
        //     const product = updatedCart.products.find(prod => prod.id === id);

        //     if (!product) {
        //         return;
        //     }

        //     const productQty = product.qty;
        //     updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
        //     updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

        //     fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        //         // console.log(err);
        //     })
        // })
    }

    static getCart(cb) {
        return db.execute('SELECT * FROM my_cart');
    }
}