const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, informe um email válido']
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres']
    },
    nome: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Isso adiciona automaticamente createdAt e updatedAt
});

// Método para buscar usuário por email
userSchema.statics.findByEmail = async function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Método para comparar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    // Só faz o hash se a senha foi modificada ou é nova
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;