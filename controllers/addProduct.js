const Product = require('../models/Product');
const shortid = require('shortid');
const fs = require('fs');
const Category = require('../models/Category');
const User = require('mongoose').model('User')

module.exports = {
  addProductGet: (req, res) => {
    Category.find({}).then(categories => {
      res.render('home/addProduct', { categories });
    })
  },
  addProductPost: (req, res) => {
    Product.find({}).then(db => {


      let body = req.body;
      let file = req.files;
      let folder = Math.ceil(db.length / 10);
      if (folder === 0) {
        folder = 1
      }
      let fileName = shortid.generate();
      if (!fs.existsSync(`./static/storage/${folder}`)) {
        fs.mkdirSync(`./static/storage/${folder}`)
      }
      let path = `./static/storage/${folder}/${fileName}.jpg`

      file.image.mv(path, err => {
        if (err) {
          console.log(err);
          return;
        }
      });
      body.price = Number(body.price);
      Product.create({
        name: body.name,
        description: body.description,
        price: body.price,
        image: `./storage/${folder}/${fileName}.jpg`,
        category: body.category,
        creator: req.user._id
      }).then((product) => {
        User.findById(req.user._id).then(foundUser => {
          foundUser.createdProducts.push(product._id);
          foundUser.save();
        })
        Category.findById(product.category).then(category => {
          category.products.push(product._id);
          category.save();
          res.redirect('/');
        })
      });
    });
  }
};