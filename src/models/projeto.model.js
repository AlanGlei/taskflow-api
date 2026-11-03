const db = require('../database/db'); // ajuste para o seu arquivo de conexão
const prisma = require('../database/prisma'); // ajuste para o seu arquivo de conexão

module.exports = {
  listar: async () => {
    const resultado = await prisma.projetos.findMany({
      orderBy: {
        nome: 'asc',
      }
    }); 
    return resultado;
  },

  buscar: async (id) => {
    const resultado = await prisma.projetos.findUnique({
      where: {
        id: id
      }
    });
    return resultado || null; // null = não existe → controller lança 404
  },

  adicionar: async ({ nome, descricao, usuario_id }) => {
    const resultado = await prisma.projetos.create({
      data: {
        nome,
        descricao: descricao || null,
        usuario_id
      }
    });
    return resultado;
  },

  atualizar: async (id, dados) => {
    const resultado = await prisma.projetos.update({
      where: {
        id: id
      },
      data: {
        nome: dados.nome || undefined,
        descricao: dados.descricao || undefined,
        usuario_id: dados.usuario_id || undefined
      }
    });
    return resultado || null;
  },

  remover: async (id) => {
    const resultado = await prisma.projetos.delete({
      where: {
        id: id
      }
    });
    return resultado || null;
  },
};