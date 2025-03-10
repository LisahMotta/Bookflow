import React, { useState, useEffect } from 'react';

const LoanList = () => {
  const [loans, setLoans] = useState([]);

  // Buscar os empréstimos no servidor
  const fetchLoans = async () => {
    const response = await fetch('http://localhost:5000/loans');
    const data = await response.json();
    setLoans(data);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Função para marcar um livro como devolvido
  const returnBook = async (loanId) => {
    const response = await fetch(`http://localhost:5000/loans/${loanId}`, {
      method: 'PUT',
    });

    if (response.ok) {
      alert('Livro devolvido com sucesso!');
      fetchLoans(); // Atualiza a lista de empréstimos
    } else {
      alert('Erro ao devolver o livro.');
    }
  };

  return (
    <div className="loan-list">
      <h2>📘 Livros Emprestados</h2>
      {loans.length === 0 ? (
        <p>Nenhum livro emprestado no momento.</p>
      ) : (
        <ul>
          {loans.map((loan) => (
            <li key={loan._id} className={`loan-item ${loan.status}`}>
              <strong>{loan.bookTitle}</strong> - {loan.studentName}
              <span className={`status ${loan.status}`}>
                {loan.status === 'emprestado' ? '📕 Emprestado' : '📗 Devolvido'}
              </span>
              {loan.status === 'emprestado' && (
                <button onClick={() => returnBook(loan._id)}>Devolver</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoanList;
