import React, { useState } from 'react';

const AddStudent = ({ onStudentAdded }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !studentId || !studentClass || !school) {
      alert('Preencha todos os campos!');
      return;
    }

    const response = await fetch('http://localhost:5000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, studentId, class: studentClass, school })
    });

    if (response.ok) {
      alert('Aluno cadastrado com sucesso!');
      setName('');
      setStudentId('');
      setStudentClass('');
      setSchool('');
      onStudentAdded();
    } else {
      alert('Erro ao cadastrar aluno.');
    }
  };

  return (
    <div className="student-form">
      <h2>📚 Cadastrar Aluno</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Aluno"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID do Aluno"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Turma"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        />
         <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default AddStudent;
