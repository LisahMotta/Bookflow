import React, { useState } from "react";
import Dashboard from "./Dashboard";
import AddBook from "./AddBook";
import BookList from "./BookList";
import StudentSearch from "./StudentSearch";
import StudentList from "./StudentList";
import LoanList from "./LoanList";
import Chatbot from "./Chatbot";
import './App.css';

function App() {
  const [view, setView] = useState("dashboard");
  const [showStudentsMenu, setShowStudentsMenu] = useState(false); 

  return (
    <div className="app-container">
      <header>
        <h1>📚 BookFlow - Biblioteca Digital</h1>
        <nav>
          <button onClick={() => setView("dashboard")}>📊 Dashboard</button>
          <button onClick={() => setView("books")}>📖 Livros</button>
          
          {/* Botão Alunos com Dropdown */}
          <div className="dropdown">
            <button onClick={() => setShowStudentsMenu(!showStudentsMenu)}>👨‍🎓 Alunos</button>
            {showStudentsMenu && (
              <div className="dropdown-menu">
                <button onClick={() => setView("searchStudent")}>🔍 Buscar Aluno</button>
                <button onClick={() => setView("studentList")}>📋 Alunos Cadastrados</button>
              </div>
            )}
          </div>

          <button onClick={() => setView("loans")}>📋 Empréstimos</button>
        </nav>
      </header>

      <main>
        {view === "dashboard" && <Dashboard />}
        {view === "books" && (
          <>
            <AddBook />
            <BookList />
          </>
        )}
        {view === "searchStudent" && <StudentSearch />} {/* Caixa de busca para CSV */}
        {view === "studentList" && <StudentList />} {/* Caixa de busca para alunos cadastrados */}
        {view === "loans" && <LoanList />}
      </main>

      <Chatbot />
    </div>
  );
}

export default App;
