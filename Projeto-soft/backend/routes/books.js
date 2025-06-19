const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// GET /api/books - Listar todos os livros (com busca opcional)
router.get('/', getAllBooks);

// GET /api/books/:id - Buscar livro por ID
router.get('/:id', getBookById);

// POST /api/books - Criar novo livro
router.post('/', createBook);

// PUT /api/books/:id - Atualizar livro
router.put('/:id', updateBook);

// DELETE /api/books/:id - Deletar livro
router.delete('/:id', deleteBook);

module.exports = router;