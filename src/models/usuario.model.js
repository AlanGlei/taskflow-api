const db = require('../database/db'); // ajuste para o seu arquivo de conexão

let usuarios = [
  { id: 1, nome: 'Alice', email: 'alice@example.com', senha: 'senha123' },
  { id: 2, nome: 'Alan', email: 'alan@example.com', senha: 'senha456' },
];
let proximoId = 3;

module.exports = {
  listar: async () => {
    const resultado = await db.query(
      'SELECT id, nome, email FROM usuarios ORDER BY nome'
    );
    return resultado.rows;
  },

  buscar: async (id) => {
    const resultado = await db.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [id]);
    return resultado.rows[0] || null; // null = não existe → controller lança 404
  },

  buscarPorEmail: async (email) => {
    const resultado = await db.query('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1', [email]);
    return resultado.rows[0] || null; // null = não existe → controller lança 404
  },

  adicionar: async ({ nome, email, senha }) => {
    const resultado = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senha]
    );
    return resultado.rows[0];
  },

  atualizar: async (id, dados) => {
    const resultado = await db.query(
      'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email',
      [dados.nome, dados.email, id]
    );
    return resultado.rows[0] || null;
  },

  remover: async (id) => {
    const resultado = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email', [id]);
    return resultado.rows[0] || null;
  },
};
