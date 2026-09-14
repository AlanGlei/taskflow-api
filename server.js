require('dotenv').config();

const express = require('express');

const tarefasRoutes  = require('./src/routes/tarefas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const projetosRoutes = require('./src/routes/projetos.routes');
const authRoutes = require('./src/routes/auth.routes');


const logger             = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const temporizador       = require('./src/middlewares/temporizador');
// const corsMiddleware     = require('./src/middlewares/cors');
const cors = require('cors');
const autenticar = require('./src/middlewares/autenticar');


// Opção 1 — aceitar qualquer origem (só em desenvolvimento)

const app   = express();

const PORTA = process.env.PORTA || 3001;

// ── Middlewares globais — sempre antes das rotas ────────────────────────────
// app.use(corsMiddleware);

app.use(cors({
  origin:         process.env.CORS_ORIGIN || 'https://www.google.com',
  methods:        ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge:         86400,
}));


app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);


// ── Rota raiz ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: 'TaskFlow API funcionando!' });
});

// ── Rotas dos recursos ──────────────────────────────────────────────────────

app.use('/tarefas', autenticar, tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);
app.use('/auth', authRoutes);

// ── Rota 404 genérica — sempre por último ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
