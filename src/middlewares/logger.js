function logger(req, res, next) {
  const agora  = new Date().toISOString();
  const metodo = req.method;
  const url    = req.originalUrl || req.url;

  // Normaliza ::1 (IPv6 loopback) para 127.0.0.1 para melhor leitura
  const ipBruto = req.ip || req.connection.remoteAddress || '';
  const ip      = ipBruto.replace('::ffff:', '').replace('::1', '127.0.0.1');

  console.log(`[${agora}] ${metodo} ${url} — IP: ${ip}`);

  next();
}

module.exports = logger;
