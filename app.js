require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./config/database');
const { logger, requestLogger, handleUncaughtErrors } = require('./utils/logger');

const app = express();

// Configurar handler de erros não tratados
handleUncaughtErrors();

// Conectar ao MongoDB
connectDB().then(() => {
    logger.info('Banco de dados inicializado com sucesso');
}).catch(err => {
    logger.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1);
});

// Configuração do motor de templates HBS
const hbs = require('express-handlebars');
app.engine('hbs', hbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configuração dos middlewares
app.use(requestLogger); // Logger de requisições HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da sessão
// Configuração dos cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Importação das rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth.routes');
const viewsRoutes = require('./routes/views.routes');

// Middleware para variáveis locais nas views
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.messages = {};
    next();
});

// Rotas de views (devem vir antes das rotas de API)
app.use('/', viewsRoutes);

// Rotas de API
app.use('/api/auth', authRoutes);
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// Tratamento de erro 404
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Página não encontrada',
        error: { status: 404 }
    });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    // Log do erro com stack trace em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        logger.error('Erro na aplicação:', err);
    } else {
        // Em produção, log sem detalhes sensíveis
        logger.error('Erro na aplicação:', {
            message: err.message,
            url: req.originalUrl,
            method: req.method
        });
    }

    res.status(err.status || 500).render('error', {
        message: err.message || 'Ocorreu um erro interno no servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    logger.info(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;