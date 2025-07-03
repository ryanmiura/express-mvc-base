/**
 * Middleware para verificar se o usuário está autenticado
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAuthenticated = (req, res, next) => {
    try {
        // Verifica se existe uma sessão e se há um usuário na sessão
        if (req.session && req.session.user) {
            // Usuário está autenticado, permite prosseguir
            return next();
        }

        // Usuário não está autenticado, redireciona para login
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro interno ao verificar autenticação'
        });
    }
};

/**
 * Middleware para verificar se o usuário NÃO está autenticado (guest)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isGuest = (req, res, next) => {
    try {
        // Verifica se NÃO existe uma sessão de usuário
        if (!req.session || !req.session.user) {
            // Usuário não está autenticado, permite prosseguir
            return next();
        }

        // Se já estiver autenticado, redireciona para home
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao verificar status de convidado:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro interno ao verificar status de convidado'
        });
    }
};

module.exports = {
    isAuthenticated,
    isGuest
};