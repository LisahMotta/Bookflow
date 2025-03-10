import React, { useState } from 'react';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Função para buscar livro na API do Google Books
    const searchBook = async (query) => {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const book = data.items[0].volumeInfo;
            return {
                title: book.title || 'Título não encontrado',
                author: book.authors ? book.authors.join(', ') : 'Autor desconhecido',
                category: book.categories ? book.categories[0] : 'Sem categoria'
            };
        } else {
            return null;
        }
    };

    // Função para cadastrar o livro no banco de dados
    const addBookToDatabase = async (book) => {
        const response = await fetch('http://localhost:5000/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: book.title,
                author: book.author,
                category: book.category,
                available: true
            })
        });

        if (response.ok) {
            setMessages(prevMessages => [...prevMessages, { text: '📚 Livro cadastrado com sucesso!', sender: 'bot' }]);
        } else {
            setMessages(prevMessages => [...prevMessages, { text: '❌ Erro ao cadastrar o livro!', sender: 'bot' }]);
        }
    };

    // Função que processa as mensagens do chatbot
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Adiciona a mensagem do usuário ao histórico
        setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);

        // Busca informações sobre o livro
        const book = await searchBook(input);

        if (book) {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: `📖 Livro encontrado: ${book.title} - ${book.author} (${book.category})`, sender: 'bot' },
                { text: 'Deseja cadastrar este livro? (Sim/Não)', sender: 'bot' }
            ]);

            // Aguarda resposta do usuário
            setTimeout(() => {
                const lastMessage = messages[messages.length - 1]?.text.toLowerCase();
                if (lastMessage === 'sim') {
                    addBookToDatabase(book);
                } else {
                    setMessages(prevMessages => [...prevMessages, { text: 'Cadastro cancelado!', sender: 'bot' }]);
                }
            }, 3000);
        } else {
            setMessages(prevMessages => [...prevMessages, { text: '⚠️ Livro não encontrado!', sender: 'bot' }]);
        }

        setInput('');
    };

    return (
        <div className="chatbot-container">
            <h2>🤖 Chatbot - Cadastro de Livros</h2>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <p key={index} className={msg.sender}>{msg.text}</p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Digite o nome do livro..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSendMessage}>Enviar</button>
        </div>
    );
}

export default Chatbot;
