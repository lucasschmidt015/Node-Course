const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { 
        pageTitle: 'Add Product',
        path: '/admin/add-product',  
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,                                
    });
}

exports.postAddProduct = (req, res) => {
    const body = req.body;
    const product = new Product(body.title, body.imageUrl, body.description, body.price);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { 
            prods: products,
            pageTitle: 'Admin Products', 
            path: '/admin/products',
        });
    });
}