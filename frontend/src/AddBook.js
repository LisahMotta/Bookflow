import React, { useEffect, useState } from 'react';
import AddBook from './AddBook';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <h2>Carregando livros...</h2>;
  }

  return (
    <div>
      <h1>Lista de Livros 📚</h1>
      <AddBook onBookAdded={fetchBooks} />
      {books.length === 0 ? (
        <p>Nenhum livro encontrado.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> - {book.author} ({book.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
