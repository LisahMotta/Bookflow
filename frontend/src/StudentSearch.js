import React, { useState } from "react";

function StudentSearch() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const searchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/students/search?q=${query}`);
      const data = await response.json();
      if (response.ok) {
        setStudents(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erro ao buscar alunos.");
    }
  };

  const registerStudent = async (student) => {
    try {
      const response = await fetch("http://localhost:5000/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: student.nome,
          matricula: student.matricula,
          turma: student.turma
        }),
      });
      const result = await response.json();
      alert(result.message || "Erro ao cadastrar aluno.");
    } catch (err) {
      alert("Erro ao cadastrar aluno.");
    }
  };

  return (
    <div>
      <h2>🔍 Buscar Aluno no CSV</h2>
      <input
        type="text"
        placeholder="Digite o nome do aluno..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchStudents()}
      />
      <button onClick={searchStudents}>Buscar</button>

      {error && <p>{error}</p>}

      <ul>
        {students.map((student) => (
          <li key={student.matricula}>
            {student.nome} - {student.matricula} ({student.turma})
            <button onClick={() => registerStudent(student)}>Cadastrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentSearch;
