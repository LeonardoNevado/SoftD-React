import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookService, rentalService } from '../services/api';
import './Shop.css';

const Shop = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rentingBook, setRentingBook] = useState(null);
  const [userRentals, setUserRentals] = useState([]);

  // Carrega os livros na inicialização
  useEffect(() => {
    loadBooks();
    loadUserRentals();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAll(searchTerm);
      setBooks(response.data || []);
    } catch (err) {
      setError('Erro ao carregar livros');
      console.error('Erro ao carregar livros:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRentals = async () => {
    try {
      if (user?.id) {
        const response = await rentalService.getUserRentals(user.id);
        setUserRentals(response.data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar aluguéis:', err);
    }
  };

  // Busca livros quando o termo de busca muda
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadBooks();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRentBook = async (book) => {
    if (rentingBook || book.isRented) return;
    
    // Validação dos dados antes de enviar
    if (!user?.id) {
      alert('Erro: Usuário não identificado. Faça login novamente.');
      return;
    }
    
    if (!book?.id) {
      alert('Erro: Livro não identificado.');
      return;
    }
    
    try {
      setRentingBook(book.id);
      
      const rentalData = {
        userId: user.id,
        bookId: book.id,
        rentalDate: new Date().toISOString(),
        returnDate: null
      };

      console.log('Dados enviados para aluguel:', rentalData); // Debug
      
      await rentalService.rent(rentalData);
      
      // Atualiza a lista de livros e aluguéis
      await loadBooks();
      await loadUserRentals();
      
      alert(`Livro "${book.title}" alugado com sucesso!`);
    } catch (err) {
      console.error('Erro completo:', err); // Debug mais detalhado
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Erro ao alugar livro. Tente novamente.';
      alert(errorMessage);
    } finally {
      setRentingBook(null);
    }
  };

  const handleReturnBook = async (rentalId) => {
    try {
      await rentalService.return(rentalId);
      await loadBooks();
      await loadUserRentals();
      alert('Livro devolvido com sucesso!');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao devolver livro');
      console.error('Erro ao devolver livro:', err);
    }
  };

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isBookRentedByUser = (bookId) => {
    return userRentals.some(rental => 
      rental.bookId === bookId && !rental.returnDate
    );
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading">Carregando livros...</div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="header-content">
          <div className="header-info">
            <h1>📚 Livraria Online</h1>
            <p>Bem-vindo, {user?.name}!</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      {/* Barra de busca */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar livros por título, autor ou gênero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Seção de Meus Aluguéis */}
      {userRentals.length > 0 && (
        <section className="my-rentals-section">
          <h2>📖 Meus Aluguéis</h2>
          <div className="rentals-grid">
            {userRentals.filter(rental => !rental.returnDate).map(rental => (
              <div key={rental.id} className="rental-card">
                <h3>{rental.book?.title}</h3>
                <p>Alugado em: {formatDate(rental.rentalDate)}</p>
                <button
                  onClick={() => handleReturnBook(rental.id)}
                  className="return-btn"
                >
                  Devolver
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid de livros */}
      <section className="books-section">
        <h2>📚 Livros Disponíveis</h2>
        
        {books.length === 0 ? (
          <div className="no-books">
            {searchTerm ? 'Nenhum livro encontrado para sua busca.' : 'Nenhum livro disponível.'}
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} />
                  ) : (
                    <div className="placeholder-image">📖</div>
                  )}
                </div>
                
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">por {book.author}</p>
                  <p className="book-genre">{book.genre}</p>
                  
                  {book.isRented && (
                    <span className="rented-badge">Alugado</span>
                  )}
                </div>
                
                <div className="book-actions">
                  <button
                    onClick={() => openBookDetails(book)}
                    className="details-btn"
                  >
                    ℹ️ Detalhes
                  </button>
                  
                  <button
                    onClick={() => handleRentBook(book)}
                    disabled={book.isRented || rentingBook === book.id || isBookRentedByUser(book.id)}
                    className={`rent-btn ${book.isRented || isBookRentedByUser(book.id) ? 'disabled' : ''}`}
                  >
                    {rentingBook === book.id ? 'Alugando...' : 
                     isBookRentedByUser(book.id) ? 'Já alugado por você' :
                     book.isRented ? 'Indisponível' : '📚 Alugar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal de detalhes do livro */}
      {showModal && selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBook.title}</h2>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>
            
            <div className="modal-body">
              <div className="book-details">
                <div className="detail-image">
                  {selectedBook.coverImage ? (
                    <img src={selectedBook.coverImage} alt={selectedBook.title} />
                  ) : (
                    <div className="placeholder-image-large">📖</div>
                  )}
                </div>
                
                <div className="detail-info">
                  <p><strong>Autor:</strong> {selectedBook.author}</p>
                  <p><strong>Gênero:</strong> {selectedBook.genre}</p>
                  <p><strong>Ano:</strong> {selectedBook.year}</p>
                  <p><strong>Páginas:</strong> {selectedBook.pages}</p>
                  <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                  <p><strong>Status:</strong> 
                    <span className={selectedBook.isRented ? 'status-rented' : 'status-available'}>
                      {selectedBook.isRented ? ' Alugado' : ' Disponível'}
                    </span>
                  </p>
                  
                  {selectedBook.description && (
                    <div className="book-description">
                      <strong>Descrição:</strong>
                      <p>{selectedBook.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                onClick={() => {
                  handleRentBook(selectedBook);
                  closeModal();
                }}
                disabled={selectedBook.isRented || rentingBook === selectedBook.id || isBookRentedByUser(selectedBook.id)}
                className={`rent-btn-modal ${selectedBook.isRented || isBookRentedByUser(selectedBook.id) ? 'disabled' : ''}`}
              >
                {rentingBook === selectedBook.id ? 'Alugando...' : 
                 isBookRentedByUser(selectedBook.id) ? 'Já alugado por você' :
                 selectedBook.isRented ? 'Indisponível' : '📚 Alugar Livro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;