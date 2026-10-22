const criarErro = require('../utils/criarErro');
const usuarioModel = require('../models/usuario.model');
const tarefaModel  = require('../models/tarefa.model');

const usuariosController = {

  // GET /usuarios — listar todos
  async listar(req, res) {
    res.json(await usuarioModel.listar());
  },

  // GET /usuarios/:id — buscar por ID
  async buscarPorId(req, res) {
    const u = await usuarioModel.buscar(parseInt(req.params.id));
    if (!u) 
      throw criarErro(404, 'Usuário não encontrado');
    res.json(u);
  },

  // POST /usuarios — criar novo usuário
  async criar(req, res) {
    const { nome, email } = req.body;

    res.status(201).json(await usuarioModel.adicionar({ nome, email }));
  },

  // PUT /usuarios/:id — editar usuário
  async atualizar(req, res) {
    const atualizado = await usuarioModel.atualizar(parseInt(req.params.id), req.body);
    if (!atualizado) throw criarErro(404, 'Usuário não encontrado');
    res.json(atualizado);
  },

  // DELETE /usuarios/:id — remover usuário
  // Regra: não permite remover usuário com tarefas associadas
  async remover(req, res) {
    const id = parseInt(req.params.id);

    const removido = await usuarioModel.remover(id);
    if (!removido) throw criarErro(404, 'Usuário não encontrado');
    res.json({ mensagem: 'Usuário removido', usuario: removido });
  },

};

module.exports = usuariosController;
