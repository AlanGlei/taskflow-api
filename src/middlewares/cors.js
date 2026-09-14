function corsMiddleware(req, res, next) {
  // Permite acesso apenas da origem do front-end
  res.setHeader('Access-Control-Allow-Origin', 'https://www.google.com');

  // Métodos HTTP que o cliente pode usar
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS');

  // Headers que o cliente pode enviar
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, Authorization');

  // Cache do preflight por 24h (86400 segundos)
  res.setHeader('Access-Control-Max-Age', '86400');

  // Responder ao preflight imediatamente com 200
  // O navegador faz OPTIONS antes de POST/PUT/DELETE
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next(); // requisições normais continuam
}

module.exports = corsMiddleware;
