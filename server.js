// Servidor estático mínimo para desplegar en Railway
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TIPOS = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.json': 'application/json', '.bin': 'application/octet-stream',
  '.css': 'text/css'
};

http.createServer((req, res) => {
  let ruta = req.url.split('?')[0];
  if (ruta === '/') ruta = '/index.html';
  const archivo = path.join(__dirname, path.normalize(ruta).replace(/^(\.\.[\/\\])+/, ''));

  fs.readFile(archivo, (err, datos) => {
    if (err) {
      res.writeHead(404);
      res.end('No encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
    res.end(datos);
  });
}).listen(PORT, () => console.log('Servidor en el puerto ' + PORT));
