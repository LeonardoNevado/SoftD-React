// Dados mock para o sistema
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    email: 'admin@livraria.com',
    password: '123456',
    name: 'Administrador'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    email: 'usuario@teste.com',
    password: 'senha123',
    name: 'Leonardo Nevado'
  }
];

const mockBooks = [
  {
    _id: '507f1f77bcf86cd799439021',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    description: 'Um dos maiores clássicos da literatura brasileira, narrando a história de Bento Santiago e seus ciúmes por Capitu.',
    genre: 'Literatura Brasileira',
    publishYear: 1899,
    isbn: '978-85-359-0277-5',
    available: true,
    rentalPrice: 15.00
  },
  {
    _id: '507f1f77bcf86cd799439022',
    title: 'O Cortiço',
    author: 'Aluísio Azevedo',
    description: 'Romance naturalista que retrata a vida em um cortiço carioca no século XIX.',
    genre: 'Literatura Brasileira',
    publishYear: 1890,
    isbn: '978-85-359-0278-2',
    available: true,
    rentalPrice: 12.00
  },
  {
    _id: '507f1f77bcf86cd799439023',
    title: '1984',
    author: 'George Orwell',
    description: 'Distopia sobre um regime totalitário que controla todos os aspectos da vida.',
    genre: 'Ficção Científica',
    publishYear: 1949,
    isbn: '978-85-359-0279-9',
    available: false,
    rentalPrice: 18.00
  },
  {
    _id: '507f1f77bcf86cd799439024',
    title: 'Cem Anos de Solidão',
    author: 'Gabriel García Márquez',
    description: 'Obra-prima do realismo mágico que narra a saga da família Buendía.',
    genre: 'Literatura Latino-americana',
    publishYear: 1967,
    isbn: '978-85-359-0280-5',
    available: true,
    rentalPrice: 20.00
  },
  {
    _id: '507f1f77bcf86cd799439025',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    description: 'Fábula poética sobre amizade, amor e perda, contada através dos olhos de um pequeno príncipe.',
    genre: 'Literatura Infantil',
    publishYear: 1943,
    isbn: '978-85-359-0281-2',
    available: true,
    rentalPrice: 10.00
  },
  {
    _id: '507f1f77bcf86cd799439026',
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    description: 'Romance clássico sobre Elizabeth Bennet e suas complexas relações familiares e amorosas.',
    genre: 'Romance',
    publishYear: 1813,
    isbn: '978-85-359-0282-9',
    available: true,
    rentalPrice: 16.00
  }
];

const mockRentals = [
  {
    _id: '507f1f77bcf86cd799439031',
    userId: '507f1f77bcf86cd799439012',
    bookId: '507f1f77bcf86cd799439023',
    rentalDate: new Date('2024-01-15'),
    returnDate: new Date('2024-02-15'),
    status: 'active'
  }
];

module.exports = {
  mockUsers,
  mockBooks,
  mockRentals
};