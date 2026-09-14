const express = require('express');
const router  = express.Router();
const tarefasController = require('../controllers/tarefas.controller');

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');


// Rotas específicas ANTES de /:id para evitar conflito
router.get('/estatisticas',        tarefasController.estatisticas);
router.get('/estatisticas/resumo', tarefasController.estatisticasResumo);

router.get('/',     tarefasController.listar);
router.post('/',    validar(schemas.tarefa), tarefasController.criar);
router.get('/:id',  tarefasController.buscarPorId);
router.put('/:id',  validar(schemas.tarefa), tarefasController.atualizar);
router.delete('/:id', tarefasController.remover);

module.exports = router;
