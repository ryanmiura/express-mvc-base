const express = require('express');
const router = express.Router();
const { isAuthenticated, isGuest } = require('../middleware/auth.middleware');

// Rota da home page (protegida)
router.get('/', isAuthenticated, (req, res) => {
    res.render('home', {
        user: req.session.user,
        title: 'Home'
    });
});

// Rota de login (apenas para guests)
router.get('/login', isGuest, (req, res) => {
    res.render('login', {
        title: 'Login'
    });
});

// Rota de registro (apenas para guests)
router.get('/register', isGuest, (req, res) => {
    res.render('register', {
        title: 'Registro'
    });
});

module.exports = router;