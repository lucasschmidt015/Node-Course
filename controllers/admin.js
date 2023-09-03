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
    product.save()
    .then(() => {
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(([product]) => {
        if (!product) {
            return res.redirect('/');
        }

        res.render('admin/edit-product', { 
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',        
            editing: editMode,              
            product: product[0]     
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
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatePrice);
    updatedProduct.save()
    .then(() => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.deleteById(productId)
    .then(() => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([products]) => {
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