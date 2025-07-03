const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller');

// Middleware de validação
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
router.post('/register', authValidations, validate, registerUser);
router.post('/login', authValidations, validate, loginUser);
router.get('/logout', logoutUser);

module.exports = router;