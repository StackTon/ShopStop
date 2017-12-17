const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    firstName: {type: mongoose.Schema.Types.String, required:true},
    lastName: {type: mongoose.Schema.Types.String, required:true},
    age: {type: mongoose.Schema.Types.Number,min: [0, 'Age must be between 0 and 120'],max: [120, 'Age must be between 0 and 120']},
    gender: {type: mongoose.Schema.Types.String,enum: {values: ['Male', 'Female'],message: 'Gender should be either "Male" or "Female".'}},
    roles: [{ type: mongoose.Schema.Types.String }],
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]

});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, 'p');
        return User.create({
            username: 'pesho',
            salt: salt,
            firstName: 'Alex',
            lastName: 'Stanoev',
            hashedPass: hashedPass,
            age: 18,
            gender: 'Male',
            roles: ['Admin']
          });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
