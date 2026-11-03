const db = require('../database/db'); // ajuste para o seu arquivo de conexão
const prisma = require('../database/prisma'); // ajuste para o seu arquivo de conexão

const prioridadeModel = {
  listar: async () => {
    const resultado = await prisma.prioridades.findMany({
      select:{id: true, descricao:true, cor:true},
      where:{ativo:true},
      orderBy: {id: 'asc'},
    });
    return resultado;

    // const resultado = await db.query(
    //   'SELECT id, descricao, ativo, cor FROM prioridades ORDER BY id'
    // );
    // return resultado.rows;
    
  },
};

module.exports = prioridadeModel;