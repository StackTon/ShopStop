const Category = require('../models/Category');

module.exports = {
    category: (req, res) => {
        let cateoryName = req.params.category;
        Category.findOne({ name: cateoryName }).populate('products').then(category => {
            for (let index = 0; index < category.products.length; index++) {
                category.products[index].image = category.products[index].image.slice(1);
            }
            category.products = category.products.filter(a => {
                return a.buyer == undefined;
            });
            res.render('viewCategory/products', { category });
        })
    }
};