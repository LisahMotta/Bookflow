import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/reports')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error("Erro ao buscar relatório:", error));
    }, []);

    if (!data) return <p>📊 Carregando relatório...</p>;

    return (
        <div className="dashboard-container">
            <h2>📊 Relatório de Empréstimos</h2>

            <div className="stats">
                <div className="stat-item">📚 Total de Empréstimos: {data.totalLoans}</div>
                <div className="stat-item">🗓 Esta Semana: {data.weeklyLoans}</div>
                <div className="stat-item">📅 Este Mês: {data.monthlyLoans}</div>
            </div>

            <div className="charts">
                <div className="chart">
                    <h3>📖 Livros Mais Emprestados</h3>
                    <Bar
                        data={{
                            labels: data.topBooks.map(book => book._id),
                            datasets: [{
                                label: 'Empréstimos',
                                data: data.topBooks.map(book => book.count),
                                backgroundColor: 'rgba(255, 99, 132, 0.6)'
                            }]
                        }}
                    />
                </div>

                <div className="chart">
                    <h3>📚 Gêneros Mais Lidos</h3>
                    <Pie
                        data={{
                            labels: data.categoryStats.map(cat => cat._id),
                            datasets: [{
                                data: data.categoryStats.map(cat => cat.count),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                            }]
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
