const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();
app.use(express.json());

// Configurar CORS (importante usar apenas UMA vez!)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://questoes-e-masmorras.vercel.app',
];
app.use(cors({
  origin: function (origin, callback) {
    // Permite também requisições de ferramentas (sem origin)
    if (!origin) {
      return callback(null, true);
    }
    const normalized = origin.replace(/\/$/, ''); // remove barra final
    if (allowedOrigins.includes(normalized)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for origin: ' + origin));
    }
  },
  credentials: true, // 🔥 permite cookies/sessão do front
}));

// Configurar sessão (sem JWT)
app.set('trust proxy', 1); // necessário para cookies "secure" atrás de proxy (Render)
app.use(session({
  secret: 'segredo-muito-seguro-aqui', // troque por algo melhor  
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // cookies "secure" em produção (HTTPS)
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // necessário para cross-site Vercel↔Render
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  },
}));

// Middleware para deixar req.user acessível
app.use((req, res, next) => {
  req.user = req.session.user || null;
  next();
});

// Rotas
const userRoutes = require('./routes/userRoute');
const aventuraRoutes = require('./routes/aventuraRoute');
const sessoesRoutes = require('./routes/sessoesRoute');

app.use('/api/user', userRoutes);
app.use('/api/aventuras', aventuraRoutes); // rota das aventuras
app.use('/api/sessoes', sessoesRoutes); // rota das sessões

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
