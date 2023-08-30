const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product',
        path: '/admin/add-product',                 
        editing: false          
    });
}

exports.postAddProduct = (req, res) => {
    const body = req.body;
    const product = new Product(null, body.title, body.imageUrl, body.description, body.price);
    product.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId, (product) => {

        if (!product) {
            return res.redirect('/');
        }

        res.render('admin/edit-product', { 
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',        
            editing: editMode,              
            product: product     
        });
    })    
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatePrice = req.body.price;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatePrice);
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.deleteById(productId, (successfull) => {
        
        res.redirect('/admin/products');
    })
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