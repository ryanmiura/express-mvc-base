const User = require('../models/user.model');

/**
 * Registra um novo usuário
 */
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const nome = name; // Mapear name para nome

        // Validação de entrada
        if (!email || !password) {
            return res.render('register', {
                title: 'Registro',
                error: 'Email e senha são obrigatórios'
            });
        }

        // Verifica se usuário já existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.render('register', {
                title: 'Registro', 
                error: 'Este email já está em uso'
            });
        }

        // Cria novo usuário
        const user = new User({
            email,
            password,
            nome
        });

        await user.save();

        // Redireciona para a página de login após registro bem-sucedido
        res.redirect('/login');

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.render('register', {
            title: 'Registro',
            error: 'Erro ao registrar usuário. Tente novamente.'
        });
    }
};

/**
 * Autentica um usuário
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação de entrada
        if (!email || !password) {
            return res.render('login', {
                title: 'Login',
                error: 'Email e senha são obrigatórios'
            });
        }

        // Busca usuário
        const user = await User.findByEmail(email);
        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Email ou senha inválidos'
            });
        }

        // Verifica senha
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.render('login', {
                title: 'Login', 
                error: 'Email ou senha inválidos'
            });
        }

        // Cria sessão
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            email: user.email,
            nome: user.nome
        };

        // Redireciona para a página inicial após login bem-sucedido
        res.redirect('/');

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.render('login', {
            title: 'Login',
            error: 'Erro ao fazer login. Tente novamente.'
        });
    }
};

/**
 * Encerra a sessão do usuário
 */
const logoutUser = (req, res) => {
    try {
        // Destrói a sessão
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao fazer logout:', err);
                return res.redirect('/');
            }

            // Limpa o cookie da sessão
            res.clearCookie('connect.sid');
            
            // Redireciona para a página de login
            res.redirect('/login');
        });

    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.redirect('/login');
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};