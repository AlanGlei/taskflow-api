const db = require('../database/db'); // ajuste para o seu arquivo de conexão

const prioridadeModel = {
  listar: async () => {
    const resultado = await db.query(
      'SELECT id, descricao, ativo FROM prioridades ORDER BY id'
    );
    return resultado.rows;
  },
};

module.exports = prioridadeModel;