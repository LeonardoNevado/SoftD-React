const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB (opcional para dados mock)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('MongoDB não conectado, usando dados mock:', err.message));

// Importar rotas
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const rentalRoutes = require('./routes/rentals');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/rentals', rentalRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend da Livraria funcionando!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use('/{*splat}', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor da Livraria rodando na porta ${PORT}`);
});