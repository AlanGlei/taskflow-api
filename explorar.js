const fs   = require('fs');
const path = require('path');
const os   = require('os');

// TAREFA 1: exibir informacoes do ambiente
console.log('=== AMBIENTE ===');
console.log('Node.js:', process.version);
console.log('Sistema:', os.platform());
console.log('Pasta atual:', __dirname);

// TAREFA 2: listar todos os arquivos da pasta atual
console.log('');
console.log('=== ARQUIVOS NA PASTA ===');
const arquivos = fs.readdirSync('.');
arquivos.forEach(arquivo => {
  console.log(' -', arquivo);
});

fs.createReadStream

// TAREFA 3: montar e exibir um caminho
console.log('');
console.log('=== CAMINHO DO FUTURO SERVIDOR ===');
const caminhoServidor = path.join(__dirname, 'src', 'server.js');
console.log('O servidor ficara em:', caminhoServidor);

// DESAFIO: descobrir quantos arquivos .js existem na pasta
const arquivosJS = arquivos.filter(a => a.endsWith('.js'));
console.log('');
console.log(`Arquivos .js encontrados: ${arquivosJS.length}`);

const arquivosTaskFlow = fs.readdirSync('../taskflow/');
arquivosTaskFlow.forEach(arquivo => {
  console.log(' -', arquivo);
});

const arquivosJS1 = arquivosTaskFlow.filter(a => a.endsWith('.js'));
console.log('');
console.log(`Arquivos .js encontrados: ${arquivosJS1.length}`);
