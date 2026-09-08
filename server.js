const express = require('express');

const tarefasRoutes  = require('./src/routes/tarefas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const projetosRoutes = require('./src/routes/projetos.routes');

const logger             = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const temporizador       = require('./src/middlewares/temporizador');

const app   = express();
const PORTA = 3001;

// ── Middlewares globais — sempre antes das rotas ────────────────────────────
app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

// ── Rota raiz ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: 'TaskFlow API funcionando!' });
});

// ── Rotas dos recursos ──────────────────────────────────────────────────────
app.use('/tarefas',  tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

// ── Rota 404 genérica — sempre por último ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
