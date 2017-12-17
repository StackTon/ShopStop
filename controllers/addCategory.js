const Category = require('../models/Category');
const User = require('mongoose').model('User');

module.exports = {
  addCategoryGet: (req, res) => {
    res.render('addCategory/addCategory');
  },
  addCategoryPost: (req, res) => {
    let categoryObj = {
      name: req.body.name,
      creator: req.user._id 
    }
    Category.create(categoryObj).then(newCategory => {
      User.findById(req.user._id).then(foundUser => {
        foundUser.createdCategories.push(newCategory._id)
        foundUser.save();
      })
      res.redirect('/')
    })
  }
};