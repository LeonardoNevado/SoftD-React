const { mockBooks, mockRentals } = require('../Data/mockData');

// Simular banco de dados em memória
let books = [...mockBooks];
let rentals = [...mockRentals];

// Listar todos os livros
const getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;
    
    let filteredBooks = books;
    
    // Filtrar por título ou autor se houver busca
    if (search) {
      filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
};

// Buscar livro por ID
const getBookById = async (req, res) => {
  try {
    const book = books.find(b => b.id === req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livro' });
  }
};

// Criar novo livro
const createBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishYear, isbn, rentalPrice } = req.body;
    
    // Validações básicas
    if (!title || !author || !description || !genre || !publishYear || !isbn || !rentalPrice) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    // Verificar se ISBN já existe
    if (books.find(b => b.isbn === isbn)) {
      return res.status(400).json({ message: 'ISBN já existe' });
    }
    
    const newBook = {
      id: new Date().getTime().toString(),
      title,
      author,
      description,
      genre,
      publishYear: parseInt(publishYear),
      isbn,
      available: true,
      rentalPrice: parseFloat(rentalPrice)
    };
    
    books.push(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar livro' });
  }
};

// Atualizar livro
const updateBook = async (req, res) => {
  try {
    const bookIndex = books.findIndex(b => b.id === req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    // Verificar se o livro está alugado
    const isRented = rentals.some(r => r.bookId === req.params.id && r.status === 'active');
    if (isRented) {
      return res.status(400).json({ message: 'Não é possível editar um livro que está alugado' });
    }
    
    const updatedBook = { ...books[bookIndex], ...req.body };
    books[bookIndex] = updatedBook;
    
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar livro' });
  }
};

// Deletar livro
const deleteBook = async (req, res) => {
  try {
    const bookIndex = books.findIndex(b => b.id === req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    // Verificar se o livro está alugado
    const isRented = rentals.some(r => r.bookId === req.params.id && r.status === 'active');
    if (isRented) {
      return res.status(400).json({ message: 'Não é possível remover um livro que está alugado' });
    }
    
    books.splice(bookIndex, 1);
    res.json({ message: 'Livro removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover livro' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};