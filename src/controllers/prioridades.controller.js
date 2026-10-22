const prioridadeModel = require('../models/prioridade.model');

const prioridadesController = {
  // GET /prioridades
  async listar(req, res) {
    const prioridades = await prioridadeModel.listar();
    res.json(prioridades);
  },
};

module.exports = prioridadesController;