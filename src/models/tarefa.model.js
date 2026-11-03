const pool = require('../database/db');
const prisma = require('../database/prisma'); // ajuste para o seu arquivo de conexão

let tarefas = [
  { id: 1, texto: 'Estudar Node',   prioridade: 'alta',  coluna: 'afazer',    usuarioId: null, projetoId: null, concluidaEm: null },
  { id: 2, texto: 'Criar API',      prioridade: 'alta',  coluna: 'andamento', usuarioId: null, projetoId: null, concluidaEm: null },
  { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido', usuarioId: null, projetoId: null, concluidaEm: null },
];
let proximoId = 4;

function formatarTarefa(tarefa) {
  const { projetos, usuarios, prioridades, ...resto } = tarefa;
  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade: prioridades?.descricao,
    prioridade_cor: prioridades?.cor,
  };
}

const tarefaJoin = {
  prioridades: { select: { descricao: true, cor: true } },
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } }
}


const tarefaModel = {
  // ── Leitura básica ──────────────────────────────────────────────────────
  // listar: () => tarefas,

  listar: async () => {

    const result = await prisma.tarefas.findMany({
      select: {
        id: true,
        texto: true,
        coluna: true,
        usuario_id: true,
        projeto_id: true,
        idprioridade: true,
        concluida_em: true,
        iniciada_em: true,
        ordem: true,
        ...tarefaJoin
      },
      orderBy: { id: 'asc' }
    });

    return result.map(formatarTarefa);
    

    // const result = await pool.query(
    //   //'SELECT * FROM tarefas ORDER BY id'
    //   `SELECT t.*, p.nome as projeto, u.nome as usuario, pr.descricao as prioridade, pr.cor as prioridade_cor FROM tarefas t
    //     inner join projetos p on t.projeto_id = p.id 
    //     inner join usuarios u on t.usuario_id = u.id
    //     inner join prioridades pr on t.idprioridade = pr.id 
    //     ORDER BY t.id`
    // );
    // return result.rows;
  },

  // buscar: (id) => tarefas.find(t => t.id === id),

  buscar: async (id) => {
    const result = await prisma.tarefas.findUnique({
      where: { id: id },
      select: {
        id: true,
        texto: true,
        coluna: true,
        usuario_id: true,
        projeto_id: true,
        idprioridade: true,
        concluida_em: true,
        iniciada_em: true,
        ordem: true,
        ...tarefaJoin
      },
    });
    return result ? formatarTarefa(result) : null;
  },      
  
  // buscar: async (id) => {
  //   const result = await pool.query(
  //       `SELECT t.*, p.nome as projeto, u.nome as usuario, pr.descricao as prioridade, pr.cor as prioridade_cor FROM tarefas t
  //       inner join projetos p on t.projeto_id = p.id 
  //       inner join usuarios u on t.usuario_id = u.id 
  //       inner join prioridades pr on t.idprioridade = pr.id 
  //       WHERE t.id = $1`, [id]
  //   );
  //   return result.rows[0] || null;
  // },

  listarPorColuna: async (coluna) => {
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE coluna = $1',
      [coluna]
    );
    return result.rows;
  },

  listarPorUsuario: async (usuarioId) => {
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE usuario_id = $1',
      [usuarioId]
    );
    return result.rows;
  },

  listarPorProjeto: async (projetoId) => {
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE projeto_id = $1',
      [projetoId]
    );
    return result.rows;
  },

  // ── Contagens — controller só pergunta, model responde ──────────────────
  // Conta tarefas em andamento de um usuário (excluirId: ignora a própria tarefa no PUT)
  contarEmAndamentoPorUsuario: async (usuarioId, excluirId) => {
    const result = await pool.query(
      'SELECT COUNT(*) FROM tarefas WHERE usuario_id = $1 AND coluna = $2 AND id != $3',
      [usuarioId, 'andamento', excluirId]
    );
    return parseInt(result.rows[0].count);
  },

  // Conta tarefas vinculadas a um projeto — usado na proteção de delete
  contarPorProjeto: async (projetoId) => {
    const result = await pool.query(
      'SELECT COUNT(*) FROM tarefas WHERE projeto_id = $1',
      [projetoId]
    );
    return parseInt(result.rows[0].count);
  },

  // Conta tarefas vinculadas a um usuário — usado na proteção de delete
  contarPorUsuario: async (usuarioId) => {
    const result = await pool.query(
      'SELECT COUNT(*) FROM tarefas WHERE usuario_id = $1',
      [usuarioId]
    );
    return parseInt(result.rows[0].count);
  },

  // ── Agregações ──────────────────────────────────────────────────────────
  // Total por coluna de uma lista — usado no resumo de projeto
  totalPorColuna: async (lista) => ({
    afazer:    lista.filter(t => t.coluna === 'afazer').length,
    andamento: lista.filter(t => t.coluna === 'andamento').length,
    concluido: lista.filter(t => t.coluna === 'concluido').length,
  }),

  // Estatísticas gerais — usadas no GET /tarefas/estatisticas
estatisticas: async (filtroColuna) => {
  const params = filtroColuna ? [filtroColuna] : [];
  const where  = filtroColuna ? 'WHERE coluna = $1' : '';

  const total = await pool.query(
    `SELECT COUNT(*) AS total FROM tarefas ${where}`, params
  );
  const porColuna = await pool.query(
    `SELECT coluna, COUNT(*) AS total FROM tarefas ${where} GROUP BY coluna`, params
  );

  const totais = { afazer: 0, andamento: 0, concluido: 0 };
  porColuna.rows.forEach(r => { totais[r.coluna] = parseInt(r.total); });

  return {
    total: parseInt(total.rows[0].total),
    porColuna: totais,
  };
},

  // Resumo textual — usado no GET /tarefas/estatisticas/resumo
resumo: async () => {
  const contagens = await pool.query(
    'SELECT coluna, COUNT(*) AS total FROM tarefas GROUP BY coluna'
  );
  const prioridades = await pool.query(
    'SELECT prioridade, COUNT(*) AS total FROM tarefas GROUP BY prioridade ORDER BY total DESC LIMIT 1'
  );

  const totais = { afazer: 0, andamento: 0, concluido: 0 };
  let totalGeral = 0;
  contagens.rows.forEach(r => {
    totais[r.coluna] = parseInt(r.total);
    totalGeral += parseInt(r.total);
  });

  const prioridadeDestaque = prioridades.rows[0]?.prioridade || 'nenhuma';

  return (
    `Você tem ${totalGeral} tarefas. ` +
    `${totais.concluido} concluída(s), ` +
    `${totais.andamento} em andamento e ` +
    `${totais.afazer} a fazer. ` +
    `Prioridade mais comum: ${prioridadeDestaque}.`
  );
},

  // ── Escrita ─────────────────────────────────────────────────────────────

adicionar: async({ texto, idprioridade, coluna, usuario_id, projeto_id, ordem }) => {
  const tarefa = await prisma.tarefas.create({
    data: {
      texto: texto,
      idprioridade: idprioridade || 2,
      coluna: coluna || 'afazer',
      usuario_id: usuario_id,
      projeto_id: projeto_id,
      ordem: ordem || 0
    },
    include: tarefaJoin
  });
  return formatarTarefa(tarefa);
},

// adicionar: async ({ texto, idprioridade, coluna, usuario_id, projeto_id, ordem }) => {
//   const result = await pool.query(
//     `INSERT INTO tarefas (texto, idprioridade, coluna, usuario_id, projeto_id, ordem)
//      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
//     [texto, idprioridade || 2, coluna || 'afazer', usuario_id, projeto_id, ordem || 0]
//   );
//   return tarefaModel.buscar(result.rows[0].id);
// },

atualizar: async (id, dados) => {
  const tarefaAtual = await prisma.tarefas.findUnique({
    where: { id: id },
  });
  if (!tarefaAtual) return null; // id não existe → controller lança 404

  const concluidaEm = dados.coluna === 'concluido' ? new Date() : null;

  let iniciadaEm = tarefaAtual.iniciada_em;
  if (tarefaAtual.coluna === 'andamento' && dados.coluna === 'afazer') {
    iniciadaEm = null;
  } else if (tarefaAtual.coluna === 'afazer' && dados.coluna === 'andamento') {
    iniciadaEm = new Date();
  }

  const tarefaAtualizada = await prisma.tarefas.update({
    where: { id: id },
    data: {
      texto: dados.texto,
      coluna: dados.coluna,
      usuario_id: dados.usuario_id,
      projeto_id: dados.projeto_id,
      idprioridade: dados.idprioridade,
      concluida_em: concluidaEm,
      iniciada_em: iniciadaEm,
      ordem: dados.ordem || 0
    },
    include: tarefaJoin
  });

  return formatarTarefa(tarefaAtualizada);
},


// atualizar: async (id, dados) => {
//   const resultadoAtual = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
//   const tarefaAtual = resultadoAtual.rows[0];
//   if (!tarefaAtual) return null; // id não existe → controller lança 404

//   const concluidaEm = dados.coluna === 'concluido' ? new Date() : null;

//   let iniciadaEm = tarefaAtual.iniciada_em;
//   if (tarefaAtual.coluna === 'andamento' && dados.coluna === 'afazer') {
//     iniciadaEm = null;
//   } else if (tarefaAtual.coluna === 'afazer' && dados.coluna === 'andamento') {
//     iniciadaEm = new Date();
//   }

//   await pool.query(
//     `UPDATE tarefas SET
//        texto        = $1,
//        coluna       = $2,
//        usuario_id   = $3,
//        projeto_id   = $4,
//        idprioridade = $5,
//        concluida_em = $6,
//        iniciada_em  = $7
//      WHERE id = $8`,
//     [dados.texto, dados.coluna, dados.usuario_id, dados.projeto_id,
//      dados.idprioridade, concluidaEm, iniciadaEm, id]
//   );

//   return tarefaModel.buscar(id);
// },

  remover: async (id) => {
    try{
    const resultado = await prisma.tarefas.delete({
      where: { id: id },
    });
    return formatarTarefa(resultado);
    }
    catch (error) {
      if (error.code === 'P2025') {
        return null; // id não existe → controller lança 404
      }
      // console.log('Objeto de erro do Prisma: ', {error});
      throw error; // relança outros erros
    }

  },

  // remover: async (id) => {
  //   const resultado = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING id', [id]);
  //   return tarefaModel.buscar(resultado.rows[0].id) || null; // null = não existe → controller lança 404
  // },
  
};

module.exports = tarefaModel
