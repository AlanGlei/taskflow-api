const usuarioModel = require('../models/usuario.model');
const tarefaModel  = require('../models/tarefa.model');

const usuariosController = {

  // GET /usuarios — listar todos
  listar(req, res) {
    res.json(usuarioModel.listar());
  },

  // GET /usuarios/:id — buscar por ID
  buscarPorId(req, res) {
    const u = usuarioModel.buscar(parseInt(req.params.id));
    if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(u);
  },

  // POST /usuarios — criar novo usuário
  criar(req, res) {
    const { nome, email } = req.body;

    if (!nome || !email)
      return res.status(400).json({ erro: 'Nome e email são obrigatórios' });

    if (usuarioModel.buscarPorEmail(email))
      return res.status(400).json({ erro: 'Email já cadastrado' });

    res.status(201).json(usuarioModel.adicionar({ nome, email }));
  },

  // PUT /usuarios/:id — editar usuário
  atualizar(req, res) {
    const atualizado = usuarioModel.atualizar(parseInt(req.params.id), req.body);
    if (!atualizado) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(atualizado);
  },

  // DELETE /usuarios/:id — remover usuário
  // Regra: não permite remover usuário com tarefas associadas
  remover(req, res) {
    const id = parseInt(req.params.id);

    if (!usuarioModel.buscar(id))
      return res.status(404).json({ erro: 'Usuário não encontrado' });

    if (tarefaModel.contarPorUsuario(id) > 0)
      return res.status(400).json({
        erro: 'Usuário possui tarefas. Remova as tarefas antes de deletar o usuário.',
      });

    const removido = usuarioModel.remover(id);
    res.json({ mensagem: 'Usuário removido', usuario: removido });
  },

};

module.exports = usuariosController;
