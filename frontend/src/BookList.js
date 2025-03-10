import React, { useState, useEffect } from 'react';
import './BookList.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [cycleFilter, setCycleFilter] = useState('');

    // Buscar livros do servidor
    useEffect(() => {
        fetch('http://localhost:5000/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error("Erro ao buscar livros:", error));
    }, []);

    // Filtro de busca
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(filter.toLowerCase()) &&
        (categoryFilter === '' || book.category === categoryFilter) &&
        (cycleFilter === '' || book.cycle === cycleFilter)
    );

    return (
        <div className="booklist-container">
            <h2>📚 Lista de Livros</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="🔍 Buscar livro..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />

                <select onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">📖 Filtrar por categoria</option>
                    <option value="Ficção">Ficção</option>
                    <option value="Fantasia">Fantasia</option>
                    <option value="Educação">Educação</option>
                    <option value="Ciência">Ciência</option>
                </select>

                <select onChange={(e) => setCycleFilter(e.target.value)}>
                    <option value="">🏫 Filtrar por ciclo</option>
                    <option value="Anos Iniciais">Anos Iniciais</option>
                    <option value="Anos Finais">Anos Finais</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>📖 Título</th>
                        <th>✍ Autor</th>
                        <th>📂 Categoria</th>
                        <th>🏫 Ciclo</th>
                        <th>🏷 Tombamento</th>
                        <th>📌 Disponível</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book) => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>{book.cycle}</td>
                            <td>{book.tombamento}</td>
                            <td>{book.available ? '✅ Sim' : '❌ Não'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="add-book-btn">➕ Adicionar Livro</button>
        </div>
    );
}

export default BookList;
