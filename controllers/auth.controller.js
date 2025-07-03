const User = require('../models/user.model');

/**
 * Registra um novo usuário
 */
const registerUser = async (req, res) => {
    try {
        const { email, password, nome } = req.body;

        // Validação de entrada
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email e senha são obrigatórios' 
            });
        }

        // Verifica se usuário já existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Este email já está em uso' 
            });
        }

        // Cria novo usuário
        const user = new User({
            email,
            password,
            nome
        });

        await user.save();

        // Inicia a sessão
        req.session.userId = user._id;

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            user: {
                id: user._id,
                email: user.email,
                nome: user.nome
            }
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ 
            message: 'Erro ao registrar usuário' 
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
            return res.status(400).json({ 
                message: 'Email e senha são obrigatórios' 
            });
        }

        // Busca usuário
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                message: 'Email ou senha inválidos' 
            });
        }

        // Verifica senha
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: 'Email ou senha inválidos' 
            });
        }

        // Cria sessão
        req.session.userId = user._id;

        res.json({
            message: 'Login realizado com sucesso',
            user: {
                id: user._id,
                email: user.email,
                nome: user.nome
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ 
            message: 'Erro ao fazer login' 
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
                return res.status(500).json({ 
                    message: 'Erro ao fazer logout' 
                });
            }

            // Limpa o cookie da sessão
            res.clearCookie('connect.sid');
            
            res.json({ 
                message: 'Logout realizado com sucesso' 
            });
        });

    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.status(500).json({ 
            message: 'Erro ao fazer logout' 
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};