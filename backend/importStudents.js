const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Verificar se a MONGO_URI está definida
if (!process.env.MONGO_URI) {
  console.error("❌ Erro: MONGO_URI não está definida. Verifique seu arquivo .env.");
  process.exit(1);
}

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// Definir o modelo do aluno
const StudentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, sparse: true }, // Evita erro de duplicidade
  nome: String,
  matricula: String,
  turma: String
});
const Student = mongoose.model('Student', StudentSchema);

// Caminho correto do arquivo CSV
const csvFilePath = path.join(__dirname, 'alunos.csv');

// Função para importar alunos do CSV para o MongoDB
async function importStudents() {
  const students = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser({ separator: ',' })) // Ajuste o separador conforme seu CSV
    .on('data', (row) => {
      if (row["Matrícula"] && row["Nome"] && row["Turma"]) {
        students.push({
          studentId: row["Matrícula"], // Garante que a matrícula seja o ID
          nome: row["Nome"],
          matricula: row["Matrícula"],
          turma: row["Turma"]
        });
      }
    })
    .on('end', async () => {
      try {
        // Upsert para evitar duplicatas e garantir atualização
        for (let student of students) {
          await Student.updateOne(
            { studentId: student.studentId }, // Se já existe, atualiza
            { $set: student },
            { upsert: true } // Se não existe, insere
          );
        }
        console.log('✅ Alunos importados com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao importar alunos:', error);
      } finally {
        mongoose.connection.close();
      }
    });
}

// Executar a importação
importStudents();
