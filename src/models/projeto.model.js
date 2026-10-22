const db = require('../database/db'); // ajuste para o seu arquivo de conexão

module.exports = {
  listar: async () => {
    const resultado = await db.query(
      'SELECT * FROM projetos ORDER BY nome'
    );
    return resultado.rows;
  },

  buscar: async (id) => {
    const resultado = await db.query(
      'SELECT * FROM projetos WHERE id = $1',
      [id]
    );
    return resultado.rows[0] || null; // null = não existe → controller lança 404
  },

  adicionar: async ({ nome, descricao, usuario_id }) => {
    const resultado = await db.query(
      `INSERT INTO projetos (nome, descricao, usuario_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nome, descricao || null, usuario_id]
    );
    return resultado.rows[0];
  },

  atualizar: async (id, dados) => {
    // COALESCE: campo não enviado mantém o valor atual (como o spread do array)
    const resultado = await db.query(
      `UPDATE projetos SET
         nome       = COALESCE($1, nome),
         descricao  = COALESCE($2, descricao),
         usuario_id = COALESCE($3, usuario_id)
       WHERE id = $4
       RETURNING *`,
      [dados.nome, dados.descricao, dados.usuario_id, id]
    );
    return resultado.rows[0] || null;
  },

  remover: async (id) => {
    const resultado = await db.query(
      'DELETE FROM projetos WHERE id = $1 RETURNING *',
      [id]
    );
    return resultado.rows[0] || null;
  },
};