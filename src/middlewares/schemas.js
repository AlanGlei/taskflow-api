const schemas = {
  id: {                                              //  NOVO
    id: { obrigatorio: true, tipo: "inteiro" },      //  NOVO
  },                                                 //  NOVO

  tarefa: {
    texto:        { obrigatorio: true, tipo: "string" },
    coluna:       { obrigatorio: true, tipo: "string", enum: ["afazer", "andamento", "concluido"] },
    usuario_id:   { obrigatorio: true, tipo: "inteiro" },   //  ALTERADO ("number" → "inteiro")
    projeto_id:   { obrigatorio: true, tipo: "inteiro" },   //  ALTERADO ("number" → "inteiro")
    idprioridade: { obrigatorio: true, tipo: "inteiro" },   //  ALTERADO ("number" → "inteiro")
  },

  usuario: {
    nome:  { obrigatorio: true, tipo: "string", minLength: 3 },
    email: { obrigatorio: true, tipo: "string", formato: "email" },
    senha: { obrigatorio: true, tipo: "string", minLength: 6 },
  },

  projeto: {
    nome:      { obrigatorio: true,  tipo: "string" },
    descricao: { obrigatorio: false, tipo: "string", maxLength: 200 },
  },
};
module.exports = schemas;
