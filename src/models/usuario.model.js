let usuarios = [
  { id: 1, nome: 'Alice', email: 'alice@example.com', senha: 'senha123' },
  { id: 2, nome: 'Alan', email: 'alan@example.com', senha: 'senha456' },
];
let proximoId = 3;

module.exports = {
  listar: () => usuarios,

  buscar: (id) => usuarios.find(u => u.id === id),

  buscarPorEmail: (email) => usuarios.find(u => u.email === email),

  adicionar: ({ nome, email }) => {
    const novo = { id: proximoId++, nome, email };
    usuarios.push(novo);
    return novo;
  },

  atualizar: (id, dados) => {
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx === -1) return null;
    usuarios[idx] = { ...usuarios[idx], ...dados, id };
    return usuarios[idx];
  },

  remover: (id) => {
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx === -1) return null;
    return usuarios.splice(idx, 1)[0];
  },
};
