// 1. Importar o Express
const express = require('express');
const TarefasRoutes = require('./src/routes/tarefas.routes');
const UsuariosRoutes = require('./src/routes/usuarios.routes');

// 2. Criar a aplicação Express
const app = express();

// 3. Definir a porta
const PORTA = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'TaskFlow API funcionando!' });
});

// Registrar as rotas
app.use('/tarefas', TarefasRoutes);
app.use('/usuarios', UsuariosRoutes);

// Iniciar o servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});