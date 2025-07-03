const express = require('express');
const router = express.Router();
const { isAuthenticated, isGuest } = require('../middleware/auth.middleware');

// Rota da home page (protegida)
router.get('/', isAuthenticated, (req, res) => {
    res.render('home', {
        user: req.session.user,
        title: 'Home',
        messages: req.flash()
    });
});

// Rota de login (apenas para guests)
router.get('/login', isGuest, (req, res) => {
    res.render('login', {
        title: 'Login',
        messages: req.flash()
    });
});

// Rota de registro (apenas para guests)
router.get('/register', isGuest, (req, res) => {
    res.render('register', {
        title: 'Registro',
        messages: req.flash()
    });
});

module.exports = router;