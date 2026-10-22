const criarErro = require('../utils/criarErro');
const projetoModel = require('../models/projeto.model');
const tarefaModel  = require('../models/tarefa.model');

const projetosController = {

  // GET /projetos — listar todos
  async listar(req, res) {
    res.json(await projetoModel.listar());
  },

  // GET /projetos/:id/resumo — resumo com totais por coluna
  async resumo(req, res) {
    const projeto = await projetoModel.buscar(parseInt(req.params.id));
    if (!projeto){
      throw criarErro(404, 'Projeto não encontrado');
    }
    const tarefas = await tarefaModel.listarPorProjeto(projeto.id);

    res.json({
      projeto,
      totalTarefas: tarefas.length,
      porColuna: await tarefaModel.totalPorColuna(tarefas),
    });
  },

  // GET /projetos/:id — buscar por ID
  async buscarPorId(req, res) {
    const p = await projetoModel.buscar(parseInt(req.params.id));
    if (!p){ 
      throw criarErro(404, 'Projeto não encontrado');
    }    
    res.json(p);
  },

  // POST /projetos — criar novo projeto
  async criar(req, res) {
    res.status(201).json(await projetoModel.adicionar(req.body));
  },

  // PUT /projetos/:id — editar projeto
  async atualizar(req, res) {
    const atualizado = await projetoModel.atualizar(parseInt(req.params.id), req.body);
    if (!atualizado) {
      throw criarErro(404, 'Projeto não encontrado');
    }
    res.json(atualizado);
  },

  // DELETE /projetos/:id — remover projeto
  async remover(req, res) {
    const removido = await projetoModel.remover(parseInt(req.params.id));
    if(!removido) {
      throw criarErro(404, 'Projeto não encontrado');
    }
    res.json({ mensagem: 'Projeto removido', projeto: removido });
  },

};

module.exports = projetosController;
