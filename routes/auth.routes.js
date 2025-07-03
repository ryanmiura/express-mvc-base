const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller');

// Middleware de validação para registro
const validateRegister = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.render('register', {
            title: 'Registro',
            error: errorMessages
        });
    }
    next();
};

// Middleware de validação para login
const validateLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.render('login', {
            title: 'Login',
            error: errorMessages
        });
    }
    next();
};

// Validações para registro e login
const authValidations = [
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter no mínimo 6 caracteres')
        .matches(/\d/)
        .withMessage('A senha deve conter pelo menos um número')
        .matches(/[A-Z]/)
        .withMessage('A senha deve conter pelo menos uma letra maiúscula')
];

// Rotas de autenticação
router.post('/register', authValidations, validateRegister, registerUser);
router.post('/login', authValidations, validateLogin, loginUser);
router.post('/logout', logoutUser);

module.exports = router;