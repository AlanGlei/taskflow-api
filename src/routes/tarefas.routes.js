// 1. Importar o Express
const express = require('express');

// 2. Criar rota para tarefas
const router = express.Router();

let tarefas = [
  { id: 1, texto: 'Estudar Node',  prioridade: 'alta',  coluna: 'afazer' },
  { id: 2, texto: 'Criar API',     prioridade: 'alta',  coluna: 'andamento' },
  { id: 3, texto: 'Testar Postman',prioridade: 'media', coluna: 'concluido' },
];

let proximoId = 4;

router.get('/', (req, res) => {
    console.log(req.headers);
    if (req.headers['tokenapi'] === '6b42e103-2d04-4b71-a550-b96b499b24f5'){
        res.json(tarefas);
    }
    else{
        res.status(401).json({erro: 'acesso negado!!!'})
    }
});

router.post('/', (req, res) => {
  // req.body contém os dados enviados no body da requisição
  const { texto, prioridade, coluna, cidade } = req.body;

  // Criar a nova tarefa com ID gerado pelo servidor
  const novaTarefa = {
    id:        proximoId++,  // usa o ID atual e incrementa
    texto:     texto,
    prioridade:prioridade || 'media',  // valor padrão se não enviado
    coluna:    coluna    || 'afazer',
    cidade:    cidade    || '',
  };

  // Adicionar ao array em memória
  tarefas.push(novaTarefa);

  // Retornar a tarefa criada com status 201 Created
  res.status(201).json(novaTarefa);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna, cidade } = req.body;

  // Encontrar o índice da tarefa no array
  const indice = tarefas.findIndex(t => t.id === id);

  // Se não encontrou — retornar 404
  if (indice === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  // Substituir a tarefa no array mantendo o mesmo ID
  const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  tarefas[indice] = tarefaAtualizada;

  // Retornar a tarefa atualizada com status 200
  res.json(tarefaAtualizada);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  // Verificar se a tarefa existe antes de remover
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  // Remover do array com filter
  tarefas = tarefas.filter(t => t.id !== id);

  // Retornar confirmação da remoção
  res.json({ mensagem: 'Tarefa removida com sucesso', id });
});

router.get('/estatisticas', (req, res) => {
  const { coluna } = req.query;

  // Se coluna foi informada — filtrar antes de calcular
  const base = coluna
    ? tarefas.filter(t => t.coluna === coluna)
    : tarefas;

  const total = base.length;

  // Total por coluna — faz sentido mesmo com filtro aplicado
  const porColuna = {
    afazer:    base.filter(t => t.coluna === 'afazer').length,
    andamento: base.filter(t => t.coluna === 'andamento').length,
    concluido: base.filter(t => t.coluna === 'concluido').length,
  };

  // Total por prioridade
  const porPrioridade = {
    alta:  base.filter(t => t.prioridade === 'alta').length,
    media: base.filter(t => t.prioridade === 'media').length,
    baixa: base.filter(t => t.prioridade === 'baixa').length,
  };

  res.json({ coluna: coluna || 'todas', total, porColuna, porPrioridade });
});

// Testar no Postman:
// GET http://localhost:3000/tarefas/estatisticas           → todas as colunas
// GET http://localhost:3000/tarefas/estatisticas?coluna=afazer  → só a fila afazer

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.json(tarefa);
});

// Atenção: esta rota deve vir ANTES de /estatisticas/:id se existir
router.get('/estatisticas/resumo', (req, res) => {
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

  const resumo = `Você tem ${total} tarefas. ` +
    `${concluidas} concluída(s), ` +
    `${andamento} em andamento e ` +
    `${afazer} a fazer. ` +
    `Prioridade mais comum: ${prioridadeDestaque}.`;

  res.json({ resumo });
});

// Testar no Postman:
// GET http://localhost:3000/tarefas/estatisticas/resumo
// Resposta: { "resumo": "Você tem 3 tarefas. 1 concluída(s), 1 em andamento e 1 a fazer. Prioridade mais comum: alta." }

module.exports = router;