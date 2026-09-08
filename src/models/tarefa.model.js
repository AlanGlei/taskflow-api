let tarefas = [
  { id: 1, texto: 'Estudar Node',   prioridade: 'alta',  coluna: 'afazer',    usuarioId: null, projetoId: null, concluidaEm: null },
  { id: 2, texto: 'Criar API',      prioridade: 'alta',  coluna: 'andamento', usuarioId: null, projetoId: null, concluidaEm: null },
  { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido', usuarioId: null, projetoId: null, concluidaEm: null },
];
let proximoId = 4;

module.exports = {
  // ── Leitura básica ──────────────────────────────────────────────────────
  listar: () => tarefas,

  buscar: (id) => tarefas.find(t => t.id === id),

  listarPorColuna: (coluna) => tarefas.filter(t => t.coluna === coluna),

  listarPorUsuario: (usuarioId) => tarefas.filter(t => t.usuarioId === usuarioId),

  listarPorProjeto: (projetoId) => tarefas.filter(t => t.projetoId === projetoId),

  // ── Contagens — controller só pergunta, model responde ──────────────────
  // Conta tarefas em andamento de um usuário (excluirId: ignora a própria tarefa no PUT)
  contarEmAndamentoPorUsuario: (usuarioId, excluirId) =>
    tarefas.filter(t =>
      t.usuarioId === usuarioId &&
      t.coluna    === 'andamento' &&
      t.id        !== excluirId
    ).length,

  // Conta tarefas vinculadas a um projeto — usado na proteção de delete
  contarPorProjeto: (projetoId) =>
    tarefas.filter(t => t.projetoId === projetoId).length,

  // Conta tarefas vinculadas a um usuário — usado na proteção de delete
  contarPorUsuario: (usuarioId) =>
    tarefas.filter(t => t.usuarioId === usuarioId).length,

  // ── Agregações ──────────────────────────────────────────────────────────
  // Total por coluna de uma lista — usado no resumo de projeto
  totalPorColuna: (lista) => ({
    afazer:    lista.filter(t => t.coluna === 'afazer').length,
    andamento: lista.filter(t => t.coluna === 'andamento').length,
    concluido: lista.filter(t => t.coluna === 'concluido').length,
  }),

  // Estatísticas gerais — usadas no GET /tarefas/estatisticas
  estatisticas: (filtroColuna) => {
    const base = filtroColuna
      ? tarefas.filter(t => t.coluna === filtroColuna)
      : tarefas;
    return {
      total: base.length,
      porColuna: {
        afazer:    base.filter(t => t.coluna === 'afazer').length,
        andamento: base.filter(t => t.coluna === 'andamento').length,
        concluido: base.filter(t => t.coluna === 'concluido').length,
      },
    };
  },

  // Resumo textual — usado no GET /tarefas/estatisticas/resumo
  resumo: () => {
    const total      = tarefas.length;
    const concluidas = tarefas.filter(t => t.coluna === 'concluido').length;
    const andamento  = tarefas.filter(t => t.coluna === 'andamento').length;
    const afazer     = tarefas.filter(t => t.coluna === 'afazer').length;
    const porPrioridade = {
      alta:  tarefas.filter(t => t.prioridade === 'alta').length,
      media: tarefas.filter(t => t.prioridade === 'media').length,
      baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
    };
    const prioridadeDestaque = Object.entries(porPrioridade)
      .sort((a, b) => b[1] - a[1])[0][0];
    return (
      `Você tem ${total} tarefas. ` +
      `${concluidas} concluída(s), ` +
      `${andamento} em andamento e ` +
      `${afazer} a fazer. ` +
      `Prioridade mais comum: ${prioridadeDestaque}.`
    );
  },

  // ── Escrita ─────────────────────────────────────────────────────────────
  adicionar: ({ texto, prioridade, coluna, usuarioId, projetoId }) => {
    const nova = {
      id:          proximoId++,
      texto,
      prioridade:  prioridade || 'media',
      coluna:      coluna     || 'afazer',
      usuarioId:   usuarioId  || null,
      projetoId:   projetoId  || null,
      concluidaEm: null,
    };
    tarefas.push(nova);
    return nova;
  },

  atualizar: (id, dados) => {
    const idx = tarefas.findIndex(t => t.id === id);
    if (idx === -1) return null;
    // Registrar data de conclusão automaticamente
    if (dados.coluna === 'concluido' && tarefas[idx].coluna !== 'concluido') {
      dados.concluidaEm = new Date().toISOString();
    }
    if (dados.coluna && dados.coluna !== 'concluido') {
      dados.concluidaEm = null;
    }
    tarefas[idx] = { ...tarefas[idx], ...dados, id };
    return tarefas[idx];
  },

  remover: (id) => {
    const idx = tarefas.findIndex(t => t.id === id);
    if (idx === -1) return null;
    return tarefas.splice(idx, 1)[0];
  },
};
