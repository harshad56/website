const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeacademy-pro', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0
        });

        winston.info(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            winston.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            winston.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            winston.info('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async() => {
            await mongoose.connection.close();
            winston.info('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        winston.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;