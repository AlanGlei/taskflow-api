// src/docs/comum.js
// Peças usadas pela documentação de TODOS os recursos

// Corpo JSON que segue um schema de components.schemas
const json = (nome) => ({
  'application/json': { schema: { $ref: `#/components/schemas/${nome}` } },
});

const jsonLista = (nome) => ({
  'application/json': { schema: { type: 'array', items: { $ref: `#/components/schemas/${nome}` } } },
});

// Parâmetro {id} da URL — serve para qualquer recurso
const parametroId = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Id do registro',
  schema: { type: 'integer', example: 1 },
};

// Schemas compartilhados
const schemas = {
  // O padrão de erro da API (Dia 1 e Dia 2)
  Erro: {
    type: 'object',
    properties: {
      erro: {
        type: 'object',
        properties: {
          mensagem: { type: 'string', example: 'Tarefa não encontrada' },
          detalhes: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
};

module.exports = { json, jsonLista, parametroId, schemas };
