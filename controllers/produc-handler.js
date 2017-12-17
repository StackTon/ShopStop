const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('mongoose').model('User');
const fs = require('fs');
const shortid = require('shortid');

module.exports = {
  viewEdit: (req, res) => {
    let productId = req.params.id;
    Product.findById(productId).then(foundProduct => {
      Category.find({}).then(categories => {
        let sortedCategories = [];
        for (let category of categories) {
          if (category._id.toString() == foundProduct.category.toString()) {
            sortedCategories.unshift(category);
          }
          else {
            sortedCategories.push(category);
          }
        }
        res.render('product/edit', { product: foundProduct, categories: sortedCategories })
      })
    })
  },

  editPost: async (req, res) => {
    let id = req.params.id.slice(1);
    let editedProduct = req.body;
    Product.findById(id).then(product => {
      if (!product) {
        res.redirect(`/?error=${encodeURIComponent('error=Product was not found')}`);
        return;
      }

      product.name = editedProduct.name;
      product.description = editedProduct.description;
      product.price = editedProduct.price;

      if (product.category.toString() !== editedProduct.category) {
        Category.findById(product.category).then(currentCategory => {
          Category.findById(editedProduct.category).then(nextCategory => {
            let index = currentCategory.products.indexOf(product._id);
            if (index >= 0) {
              currentCategory.products.splice(index, 1);
            }
            if (!currentCategory.products) {
              currentCategory.products = [];
            }
            currentCategory.save().then().catch(console.log)

            nextCategory.products.push(product._id);
            nextCategory.save();

            product.category = editedProduct.category;

            if (req.files.image) {
              //delete img
              let pathDelete = './static' + product.image.slice(1);
              fs.unlinkSync(pathDelete);
              //save img
              Product.find({}).then(db => {
                let file = req.files;
                let folder = Math.ceil(db.length / 10);
                let fileName = shortid.generate();
                let path = `./static/storage/${folder}/${fileName}.jpg`
                product.image = `./storage/${folder}/${fileName}.jpg`;
                if (folder === 0) {
                  folder = 1
                }
    
                if (!fs.existsSync(`./static/storage/${folder}`)) {
                  fs.mkdirSync(`./static/storage/${folder}`)
                }
    
    
                file.image.mv(path, err => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  product.save().then(() => {
                    res.redirect(`/?succes=` + encodeURIComponent('Product was edited sucessfully!'));
                  }).catch(e => console.log(e));
                });
              });   
            }
            else {
              product.save().then(() => {
                res.redirect(`/?succes=` + encodeURIComponent('Product was edited sucessfully!'));
              }).catch(e => console.log(e));
            }
          }).catch(e => console.log(e));
        }).catch(e => console.log(e));
      }
      else {
        if (req.files.image) {
          //delete img
          let pathDelete = './static' + product.image.slice(1);
          fs.unlinkSync(pathDelete);
          //save img
          Product.find({}).then(db => {
            let file = req.files;
            let folder = Math.ceil(db.length / 10);
            let fileName = shortid.generate();
            let path = `./static/storage/${folder}/${fileName}.jpg`
            product.image = `./storage/${folder}/${fileName}.jpg`;
            if (folder === 0) {
              folder = 1
            }

            if (!fs.existsSync(`./static/storage/${folder}`)) {
              fs.mkdirSync(`./static/storage/${folder}`)
            }


            file.image.mv(path, err => {
              if (err) {
                console.log(err);
                return;
              }
              product.save().then(() => {
                res.redirect(`/?succes=` + encodeURIComponent('Product was edited sucessfully!'));
              }).catch(e => console.log(e));
            });
          });   
        }
        else {
          product.save().then(() => {
            res.redirect(`/?succes=` + encodeURIComponent('Product was edited sucessfully!'));
          }).catch(e => console.log(e));
        }

      }
    }).catch(e => console.log(e));
  },

  viewDelete: (req, res) => {
    let productId = req.params.id;
    Product.findById(productId).then(foundProduct => {
      res.render('product/delete', foundProduct);
    })
  },

  deletePost: (req, res) => {
    let productId = req.params.id.slice(1);
    Product.findById(productId).then(foundProduct => {
      if (!foundProduct) {
        res.redirect(`/?error=${encodeURIComponent('error=Product was not found')}`);
        return;
      }
      Category.findById(foundProduct.category).then(currentCategory => {
        let index = currentCategory.products.indexOf(foundProduct._id);
        if (index >= 0) {
          currentCategory.products.splice(index, 1);
        }
        if (!currentCategory.products) {
          currentCategory.products = [];
        }
        currentCategory.save().then().catch(console.log)
        Product.findByIdAndRemove(productId, err => {
          if (err) {
            console.log(err);
            return;
          }
          User.findById(req.user._id).then(foundUser => {
            let index = foundUser.createdProducts.indexOf(productId._id);
            console.log(foundUser.createdProducts.length);
            foundUser.createdProducts.splice(index, 1);
            console.log(foundUser.createdProducts.length);
            foundProduct.save();
          })
          let pathDelete = './static' + foundProduct.image.slice(1);
          fs.unlinkSync(pathDelete);
          res.redirect(`/?succes=` + encodeURIComponent('Product was deleted sucessfully!'));
        })
      })
    })
  },

  viewBuy: (req, res) => {
    let productId = req.params.id;
    Product.findById(productId).then(product => {
      res.render('product/add', product)
    })
  },

  buyPost: (req, res) => {
    let prodictId = req.params.id;
    Product.findById(prodictId).then(product => {
      if(product.buyer){
        let error = `error=${encodeURIComponent('Product was already bougth!')}`;
        res.redirect(`/?${error}`);
        return;
      }

      product.buyer = req.user._id;
      product.save().then(() => {
        req.user.boughtProducts.push(prodictId)
        req.user.save().then(() => {
          res.redirect('/')
        })
      })
    })
  }
};