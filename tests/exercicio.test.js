// tests/exercicio.test.js
const criarErro = require('../src/utils/criarErro');
const traduzirErroPrisma = require('../src/utils/traduzirErroPrisma');

describe('exercício do Dia 3', () => {
  test('1. criarErro(500, ...) tem status 500 e detalhes undefined', () => {
    // Preparar e Executar
    const erro = criarErro(500, 'Erro interno no servidor');

    // Verificar
    expect(erro.status).toBe(500);
    expect(erro.detalhes).toBeUndefined();
  });

  test('2. P2003 ao atualizar (PUT) vira 400 com a mensagem certa', () => {
    const erro = traduzirErroPrisma({ code: 'P2003' }, 'PUT');

    expect(erro.status).toBe(400);
    expect(erro.message).toBe('Um dos ids informados não existe');
  });

  test('3. P2025 tem a mensagem "Registro não encontrado"', () => {
    const erro = traduzirErroPrisma({ code: 'P2025' }, 'DELETE');

    expect(erro.message).toBe('Registro não encontrado');
  });

  test('4. P2003 ao excluir tem a mensagem que explica o motivo', () => {
    const erro = traduzirErroPrisma({ code: 'P2003' }, 'DELETE');

    expect(erro.message).toBe('Não é possível excluir: existem registros ligados a este');
  });
});