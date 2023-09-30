const Product = require('../models/product');
const mongoDb = require('mongodb');

const ObjectId = mongoDb.ObjectId;
//you have to replace all occurrences of findById with findByPk()

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product',
        path: '/admin/add-product',                 
        editing: false          
    });
}

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl)
    product.save()
    .then(result => {
        console.log('Created product');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    })
    
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product => {

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
    .catch(err => {
        console.log(err);
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatePrice = req.body.price;
    
    const updatedProduct = new Product(updatedTitle, updatePrice, updatedDescription, updatedImageUrl, new ObjectId(prodId));
    updatedProduct.save()
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

// exports.postDeleteProduct = (req, res, next) => {
//     const productId = req.body.productId;

//     Product.findByPk(productId)
//     .then(product => { 
//         return product.destroy();
//     })
//     .then(result => {
//         console.log('Destroyed product');
//         res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// }

exports.getProducts = (req, res, next) => {

    Product.fetchAll()
    .then(products => {
        res.render('admin/products', { 
            prods: products,
            pageTitle: 'Admin Products', 
            path: '/admin/products',
        });
    })
    .catch(err => {
        console.log(err);
    });
}