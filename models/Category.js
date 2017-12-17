const mongoose = require('mongoose');

const categoryModel = mongoose.Schema({
  name: {type: mongoose.Schema.Types.String, require: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
  products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('Category', categoryModel);