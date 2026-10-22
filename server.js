require('dotenv').config();

const express = require('express');
const criarErro = require('./src/utils/criarErro');
const tarefasRoutes  = require('./src/routes/tarefas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const projetosRoutes = require('./src/routes/projetos.routes');
const authRoutes = require('./src/routes/auth.routes');
const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const temporizador = require('./src/middlewares/temporizador');
const cors = require('cors');
const autenticar = require('./src/middlewares/autenticar');
const pool = require('./src/database/db');
const tratarErros = require('./src/middlewares/erro.middleware');
const prioridadesRoutes = require('./src/routes/prioridades.routes');
const app   = express();
const PORTA = process.env.PORTA || 3001;

// ── Middlewares globais — sempre antes das rotas ────────────────────────────
app.use(cors({
  origin:         process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods:        ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge:         86400,
}));
app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

// ── Testando conexão com o banco de dados ────────────────────────────
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Erro ao conectar:', err.message);
  else     console.log('Banco conectado:', res.rows[0].now);
});

// ── Rota raiz ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: 'TaskFlow API funcionando!' });
});

// ── Rotas dos recursos ──────────────────────────────────────────────────────
app.use('/tarefas', autenticar, tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);
app.use('/auth', authRoutes);
app.use('/prioridades', autenticar,prioridadesRoutes);

// ── Rota 404 genérica — sempre por último ───────────────────────────────────
app.use((req, res) => {
  throw criarErro(404, 'Rota não encontrada');
});

// ── Middleware para tratamento de erros — sempre por último ───────────────────────────────────
app.use(tratarErros);

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
