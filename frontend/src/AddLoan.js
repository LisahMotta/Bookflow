import React, { useState, useEffect } from 'react';

const AddLoan = ({ onLoanAdded }) => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [bookTitle, setBookTitle] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:5000/students');
      const data = await response.json();
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !bookTitle) {
      alert('Selecione um aluno e um livro!');
      return;
    }

    const response = await fetch('http://localhost:5000/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, bookTitle })
    });

    if (response.ok) {
      alert('Empréstimo registrado com sucesso!');
      setStudentId('');
      setBookTitle('');
      onLoanAdded();
    } else {
      alert('Erro ao registrar empréstimo.');
    }
  };

  return (
    <div className="loan-form">
      <h2>📘 Registrar Empréstimo</h2>
      <form onSubmit={handleSubmit}>
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Selecione um aluno</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.class}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Título do Livro"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <button type="submit">Emprestar Livro</button>
      </form>
    </div>
  );
};

export default AddLoan;
