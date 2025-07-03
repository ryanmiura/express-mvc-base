const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Estas opções não são mais necessárias no Mongoose 6+, mas mantidas para compatibilidade
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB conectado: ${conn.connection.host}`);

        // Listeners para eventos de conexão
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Erro na conexão MongoDB:', err);
        });

        return conn;
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;