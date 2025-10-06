const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

//Conectar ao MongoDB
connectDB();
app.use(express.json());

//Permitir que o front acesse o back
const cors = require('cors');
app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));

//Rotas
const userRoutes = require('./routes/userRoute');
app.use('/api/user', userRoutes);

//Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});