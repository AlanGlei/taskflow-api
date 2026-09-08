function temporizador(req, res, next) {
  const inicio = Date.now();

  // Interceptar o momento em que a resposta é enviada
  // res.on('finish') dispara quando o Express termina de enviar a resposta
  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    console.log(`[TEMPO] ${req.method} ${req.url} — ${duracao}ms`);
  });

  next();
}

module.exports = temporizador;
