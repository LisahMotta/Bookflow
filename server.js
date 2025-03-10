const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Modelo de Aluno
const StudentSchema = new mongoose.Schema({
  nome: String,
  matricula: { type: String, unique: true },
  turma: String,
});
const Student = mongoose.model("Student", StudentSchema);

// Caminho do arquivo CSV
const alunosFilePath = path.join(__dirname, "backend/alunos.csv");

// Função para detectar separador do CSV
const detectSeparator = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);
      if (data.includes(";")) resolve(";");
      else if (data.includes(",")) resolve(",");
      else reject("Formato de CSV inválido.");
    });
  });
};

// Função para carregar alunos do CSV
const loadStudentsFromCSV = async () => {
  try {
    const separator = await detectSeparator(alunosFilePath);
    return new Promise((resolve, reject) => {
      let students = [];
      fs.createReadStream(alunosFilePath)
        .pipe(csv({ separator }))
        .on("data", (row) => {
          if (row["Nome"] && row["Matricula"]) {
            students.push({
              nome: row["Nome"].trim(),
              matricula: row["Matricula"].trim(),
              turma: row["Turma"] ? row["Turma"].trim() : "",
            });
          }
        })
        .on("end", () => {
          console.log(`✅ ${students.length} alunos carregados do CSV.`);
          resolve(students);
        })
        .on("error", (error) => reject(error));
    });
  } catch (error) {
    console.error("❌ Erro ao carregar CSV:", error);
    return [];
  }
};

// Rota para buscar alunos no CSV
app.get("/students/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Parâmetro de busca não fornecido." });

  try {
    const students = await loadStudentsFromCSV();
    const filteredStudents = students.filter(student =>
      student.nome.toLowerCase().includes(q.toLowerCase())
    );

    if (filteredStudents.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    res.json(filteredStudents);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar alunos." });
  }
});

// Rota para cadastrar aluno no banco de dados
app.post("/students/register", async (req, res) => {
  const { nome, matricula, turma } = req.body;

  if (!nome || !matricula) {
    return res.status(400).json({ error: "Nome e matrícula são obrigatórios." });
  }

  try {
    let student = await Student.findOne({ matricula });
    if (student) {
      return res.json({ message: `✅ Aluno ${student.nome} já cadastrado na biblioteca.` });
    }

    student = new Student({ nome, matricula, turma });
    await student.save();

    res.json({ message: `✅ Aluno ${nome} cadastrado com sucesso!`, student });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: "Erro interno ao cadastrar aluno." });
  }
});

// Rota para listar alunos cadastrados
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar alunos cadastrados." });
  }
});

// Inicializar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
