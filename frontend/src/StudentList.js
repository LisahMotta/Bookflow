import React, { useState, useEffect } from "react";

function StudentList() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/students");
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data || []); // Garante que students não seja undefined
      } else {
        setError(data.error || "Erro ao carregar alunos.");
        setStudents([]); // Evita erro ao filtrar
      }
    } catch (err) {
      setError("Erro ao buscar alunos cadastrados.");
      setStudents([]); // Evita erro ao filtrar
    }
  };

  return (
    <div>
      <h2>📋 Alunos Cadastrados</h2>
      <input
        type="text"
        placeholder="Digite o nome do aluno..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p>{error}</p>}

      <ul>
        {students.length > 0 ? (
          students
            .filter((student) => student.nome && student.nome.toLowerCase().includes(query.toLowerCase()))
            .map((student) => (
              <li key={student.matricula}>
                {student.nome} - {student.matricula} ({student.turma})
              </li>
            ))
        ) : (
          <p>Nenhum aluno cadastrado.</p>
        )}
      </ul>
    </div>
  );
}

export default StudentList;
