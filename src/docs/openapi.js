// src/docs/openapi.js
// O documento OpenAPI: informações gerais + a junção de todos os recursos

const comum   = require('./comum');
const tarefas = require('./tarefas.docs');
// Trabalho complementar: um arquivo por recurso
// const prioridades = require('./prioridades.docs');
// const projetos    = require('./projetos.docs');
// const usuarios    = require('./usuarios.docs');
// const auth        = require('./auth.docs');

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'API do TaskFlow · SENAI CTGAS-ER · Programador Full Stack',
  },
  servers: [
    { url: '/', description: 'Este servidor' },
  ],

  // Vale para todas as rotas: exige o token JWT
  security: [{ bearerAuth: [] }],

  paths: {
    ...tarefas.paths,
  },

  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ...comum.schemas,
      ...tarefas.schemas,
    },
  },
};
