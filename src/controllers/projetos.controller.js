const projetoModel = require('../models/projeto.model');
const tarefaModel  = require('../models/tarefa.model');

const projetosController = {

  // GET /projetos — listar todos
  listar(req, res) {
    res.json(projetoModel.listar());
  },

  // GET /projetos/:id/resumo — resumo com totais por coluna
  resumo(req, res) {
    const projeto = projetoModel.buscar(parseInt(req.params.id));
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

    const tarefas = tarefaModel.listarPorProjeto(projeto.id);

    res.json({
      projeto,
      totalTarefas: tarefas.length,
      porColuna:    tarefaModel.totalPorColuna(tarefas),
    });
  },

  // GET /projetos/:id — buscar por ID
  buscarPorId(req, res) {
    const p = projetoModel.buscar(parseInt(req.params.id));
    if (!p) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.json(p);
  },

  // POST /projetos — criar novo projeto
  criar(req, res) {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: 'O campo nome é obrigatório' });
    res.status(201).json(projetoModel.adicionar(req.body));
  },

  // PUT /projetos/:id — editar projeto
  atualizar(req, res) {
    const atualizado = projetoModel.atualizar(parseInt(req.params.id), req.body);
    if (!atualizado) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.json(atualizado);
  },

  // DELETE /projetos/:id — remover projeto
  // Regra: não permite remover projeto com tarefas associadas
  remover(req, res) {
    const id = parseInt(req.params.id);

    if (!projetoModel.buscar(id))
      return res.status(404).json({ erro: 'Projeto não encontrado' });

    if (tarefaModel.contarPorProjeto(id) > 0)
      return res.status(400).json({
        erro: 'Projeto possui tarefas associadas. Remova as tarefas antes de deletar o projeto.',
      });

    const removido = projetoModel.remover(id);
    res.json({ mensagem: 'Projeto removido', projeto: removido });
  },

};

module.exports = projetosController;
