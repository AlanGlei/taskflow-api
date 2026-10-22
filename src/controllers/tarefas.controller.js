 const criarErro = require('../utils/criarErro');

const tarefaModel  = require('../models/tarefa.model');
const usuarioModel = require('../models/usuario.model');

const PRIORIDADES_VALIDAS = ['alta', 'media', 'baixa'];
const COLUNAS_VALIDAS     = ['afazer', 'andamento', 'concluido'];

const tarefasController = {

  // GET /tarefas — listar todas (com filtros opcionais por coluna e usuarioId)
  async listar(req, res) {
    const { coluna, usuarioId } = req.query;
    let resultado = await tarefaModel.listar();
    if (coluna)    resultado = resultado.filter(t => t.coluna === coluna);
    if (usuarioId) resultado = resultado.filter(t => t.usuarioId === parseInt(usuarioId));
    res.json(resultado);
  },

  // GET /tarefas/estatisticas
  async estatisticas(req, res) {
    res.json(tarefaModel.estatisticas(req.query.coluna));
  },

  // GET /tarefas/estatisticas/resumo
  estatisticasResumo(req, res) {
    res.json({ resumo: tarefaModel.resumo() });
  },

  // GET /tarefas/:id — buscar por ID
  async buscarPorId(req, res) {
    const tarefa = await tarefaModel.buscar(parseInt(req.params.id));
    if (!tarefa) 
      throw criarErro(404, 'Tarefa não encontrada');
      // return res.status(404).json({ erro: 'Tarefa não encontrada' });

    res.json(tarefa);
  },

  // POST /tarefas — criar nova tarefa
  async criar(req, res) {
    res.status(201).json(await tarefaModel.adicionar(req.body));
  },

  // PUT /tarefas/:id — atualizar tarefa
  async atualizar(req, res) {
    const id = parseInt(req.params.id);

    const atualizada = await tarefaModel.atualizar(id, req.body);
    if (!atualizada) 
      throw criarErro(404, 'Tarefa não encontrada');
    res.json(atualizada);
  },

  // DELETE /tarefas/:id — remover tarefa
  async remover(req, res) {
    const removida = await tarefaModel.remover(parseInt(req.params.id));
    if (!removida) 
      throw criarErro(404, 'Tarefa não encontrada');
    res.json({ mensagem: 'Tarefa removida', tarefa: removida });
  },

};

module.exports = tarefasController;
