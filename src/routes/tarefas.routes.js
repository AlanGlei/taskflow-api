const express = require('express');
const router  = express.Router();
const tarefasController = require('../controllers/tarefas.controller');

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');

const idValido = validar(schemas.id, "params");



// Rotas específicas ANTES de /:id para evitar conflito
router.get('/estatisticas',        tarefasController.estatisticas);
router.get('/estatisticas/resumo', tarefasController.estatisticasResumo);

router.get('/',     tarefasController.listar);
router.post('/',    validar(schemas.tarefa), tarefasController.criar);
router.get('/:id', idValido, tarefasController.buscarPorId);

// router.put('/:id',  idValido, validar(schemas.tarefa), tarefasController.atualizar);
router.put('/:id',  idValido, tarefasController.atualizar);

router.delete('/:id', idValido, tarefasController.remover);

module.exports = router;
