const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf, colorize } = format;

// Definição dos níveis de log e cores
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
};

// Adiciona cores ao Winston
winston.addColors(colors);

// Formato personalizado de log
const logFormat = printf(({ level, message, timestamp, stack }) => {
    if (stack) {
        return `${timestamp} [${level}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level}]: ${message}`;
});

// Criação do logger
const logger = winston.createLogger({
    levels,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Log para console com cores
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            )
        }),
        // Log de erros para arquivo
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // Log geral para arquivo
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// Handler para erros não tratados
const handleUncaughtErrors = () => {
    process.on('uncaughtException', (error) => {
        logger.error('Erro não tratado:', error);
        // Garante que o processo termine após registrar o erro
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Promessa rejeitada não tratada:', reason);
    });
};

// Função auxiliar para tratar erros assíncronos
const asyncErrorHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            logger.error('Erro assíncrono:', error);
            next(error);
        }
    };
};

// Middleware de log para requisições HTTP
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );
    });

    next();
};

// Garante que o diretório de logs existe
const fs = require('fs');
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = {
    logger,
    asyncErrorHandler,
    requestLogger,
    handleUncaughtErrors
};