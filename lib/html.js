export function notFoundHTML() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Página no encontrada</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .box { text-align: center; }
    h1 { font-size: 8rem; font-weight: 700; letter-spacing: -0.04em; }
    p { color: #666; margin-top: 1rem; font-size: 1.1rem; }
  </style>
</head>
<body>
  <div class="box">
    <h1>404</h1>
    <p>Esta página no existe.</p>
  </div>
</body>
</html>`;
}

export function errorHTML(message = '') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Error</title>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 4rem; background: #000; color: #fff; }
  </style>
</head>
<body>
  <h1>Error cargando la página</h1>
  ${message ? `<p style="color:#666;margin-top:1rem">${message}</p>` : ''}
</body>
</html>`;
}
