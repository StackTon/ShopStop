const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);

    app.get('/product/add', restrictedPages.isAuthed, controllers.addProduct.addProductGet);
    app.post('/product/add', restrictedPages.isAuthed, controllers.addProduct.addProductPost);

    app.get('/register', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);

    app.get('/category/add',restrictedPages.hasRole('Admin'), controllers.category.addCategoryGet);
    app.post('/category/add',restrictedPages.hasRole('Admin'), controllers.category.addCategoryPost);

    app.get('/category/:category/products', controllers.viewCategory.category);

    app.get('/product/edit/:id',restrictedPages.isAuthed, controllers.product.viewEdit);
    app.post('/product/edit/:id',restrictedPages.isAuthed, controllers.product.editPost);

    app.get('/product/delete/:id',restrictedPages.isAuthed, controllers.product.viewDelete);
    app.post('/product/delete/:id',restrictedPages.isAuthed, controllers.product.deletePost);

    app.get('/product/buy/:id',restrictedPages.isAuthed, controllers.product.viewBuy);
    app.post('/product/buy/:id',restrictedPages.isAuthed, controllers.product.buyPost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};