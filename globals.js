// __dirname — caminho absoluto da pasta do arquivo atual
console.log(__dirname);
// Resultado: C:\Users\aluno\taskflow-api

// __filename — caminho completo do arquivo atual
console.log(__filename);
// Resultado: C:\Users\aluno\taskflow-api\globals.js

// process.version — versao do Node em uso
console.log(process.version);
// Resultado: v22.x.x

// process.platform — sistema operacional
console.log(process.platform);
// Resultado: win32 (Windows) | linux | darwin (Mac)

// process.env — variaveis de ambiente (muito usado!)
console.log(process.env.PATH);

// process.argv — argumentos passados na linha de comando
// node globals.js argumento1 argumento2
console.log(process.argv);
// Resultado: [ 'node', 'globals.js', 'argumento1', 'argumento2' ]
