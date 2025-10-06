const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();
app.use(express.json());

// Rotas
const userRoutes = require('./routes/userRoute');
app.use('/api/user', userRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});