require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./config/database');

const app = express();

// Conectar ao MongoDB
connectDB().then(() => {
    console.log('Banco de dados inicializado');
}).catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1);
});

// Configuração do motor de templates HBS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da sessão
app.use(session({
    secret: 'express-mvc-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Em produção, alterar para true se usando HTTPS
}));

// Importação das rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth.routes');

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Outras rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Tratamento de erro 404
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Página não encontrada',
        error: { status: 404 }
    });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;