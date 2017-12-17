const Product = require('../models/Product');

module.exports = {
    index: (req, res) => {

        Product.find({}).populate('category').then(products => {
            let query = req.query.query;
            let sortedProducts = products;
            if (query) {
                for (let i = 0; i < sortedProducts.length; i++) {
                    if (sortedProducts[i].name.indexOf(query) === -1) {
                        sortedProducts.splice(i, 1);
                    }
                }
            }
            sortedProducts = sortedProducts.filter(a => {
                return a.buyer == undefined;
            });
            let data = { products: sortedProducts };
            if (req.query.error) {
                data.error = req.query.error;
            }
            else if (req.query.succes) {
                data.succes = req.query.succes;
            }
            res.render('home/index', data);
        })
    }
};