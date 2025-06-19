const { mockBooks, mockRentals } = require('../Data/mockData');

// Simular banco de dados em memória (importar das mesmas variáveis do bookController)
let books = [...mockBooks];
let rentals = [...mockRentals];

// Alugar um livro
const rentBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    
    if (!bookId || !userId) {
      return res.status(400).json({ message: 'ID do livro e usuário são obrigatórios' });
    }
    
    // Encontrar o livro
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    // Verificar se está disponível
    if (!books[bookIndex].available) {
      return res.status(400).json({ message: 'Livro não está disponível para aluguel' });
    }
    
    // Criar aluguel
    const newRental = {
      id: new Date().getTime().toString(),
      userId,
      bookId,
      rentalDate: new Date(),
      returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      status: 'active'
    };
    
    // Atualizar disponibilidade do livro
    books[bookIndex].available = false;
    
    // Adicionar aluguel
    rentals.push(newRental);
    
    res.status(201).json({
      message: 'Livro alugado com sucesso',
      rental: newRental
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alugar livro' });
  }
};

// Devolver um livro
const returnBook = async (req, res) => {
  try {
    const { rentalId } = req.params;
    
    // Encontrar o aluguel
    const rentalIndex = rentals.findIndex(r => r.id === rentalId);
    if (rentalIndex === -1) {
      return res.status(404).json({ message: 'Aluguel não encontrado' });
    }
    
    const rental = rentals[rentalIndex];
    
    // Verificar se já foi devolvido
    if (rental.status === 'returned') {
      return res.status(400).json({ message: 'Livro já foi devolvido' });
    }
    
    // Atualizar status do aluguel
    rentals[rentalIndex].status = 'returned';
    
    // Tornar o livro disponível novamente
    const bookIndex = books.findIndex(b => b.id === rental.bookId);
    if (bookIndex !== -1) {
      books[bookIndex].available = true;
    }
    
    res.json({
      message: 'Livro devolvido com sucesso',
      rental: rentals[rentalIndex]
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erro ao devolver livro' });
  }
};

// Listar aluguéis de um usuário
const getUserRentals = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userRentals = rentals
      .filter(r => r.userId === userId)
      .map(rental => {
        const book = books.find(b => b.id === rental.bookId);
        return {
          ...rental,
          book
        };
      });
    
    res.json(userRentals);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aluguéis' });
  }
};

module.exports = {
  rentBook,
  returnBook,
  getUserRentals
};