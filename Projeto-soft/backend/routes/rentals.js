const express = require('express');
const router = express.Router();
const {
  rentBook,
  returnBook,
  getUserRentals
} = require('../controllers/rentalController');

// POST /api/rentals - Alugar um livro
router.post('/', rentBook);

// PUT /api/rentals/:rentalId/return - Devolver um livro
router.put('/:rentalId/return', returnBook);

// GET /api/rentals/user/:userId - Listar aluguéis de um usuário
router.get('/user/:userId', getUserRentals);

module.exports = router;