const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./dbFunctions');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- GET ALL ---
app.get('/usuarios', (req, res) => res.json(db.getAllUsuarios()));
app.get('/ventas', (req, res) => res.json(db.getAllVentas()));
app.get('/detalles', (req, res) => res.json(db.getAllDetalles()));
app.get('/productos', (req, res) => res.json(db.getAllProductos()));
app.get('/categorias', (req, res) => res.json(db.getAllCategorias()));

// --- GET BY ID ---
app.get('/usuarios/:id', (req, res) => {
  const usuario = db.getUsuarioById(Number(req.params.id));
  usuario ? res.json(usuario) : res.status(404).json({ error: 'Usuario no encontrado' });
});
app.get('/ventas/:id', (req, res) => {
  const venta = db.getVentaById(Number(req.params.id));
  venta ? res.json(venta) : res.status(404).json({ error: 'Venta no encontrada' });
});
app.get('/detalles/:id', (req, res) => {
  const detalle = db.getDetalleById(Number(req.params.id));
  detalle ? res.json(detalle) : res.status(404).json({ error: 'Detalle no encontrado' });
});
app.get('/productos/:id', (req, res) => {
  const producto = db.getProductoById(Number(req.params.id));
  producto ? res.json(producto) : res.status(404).json({ error: 'Producto no encontrado' });
});
app.get('/categorias/:id', (req, res) => {
  const categoria = db.getCategoriaById(Number(req.params.id));
  categoria ? res.json(categoria) : res.status(404).json({ error: 'Categoría no encontrada' });
});

//SUSAN REPORT
app.get('/report/ventas', (req, res) => {
  const ventas = db.getAllVentas();
  const detalles = db.getAllDetalles();
  const productos = db.getAllProductos();

  // build HTML string
  let html = '<html><head><meta charset="utf-8"><title>Reporte de Ventas</title></head><body>';
  html += '<h1>Reporte de Ventas</h1>';
  ventas.forEach((v, idx) => {
    html += `<h2>Venta #${idx+1} - Total: Bs ${v.monto_total}</h2>`;
    html += '<table border="1" cellpadding="4" cellspacing="0"><tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>';
    detalles.filter(d => d.venta_id == (v.Venta_id ?? idx+1)).forEach(d => {
      const p = productos.find(px => px.producto_id == d.producto_id);
      const name = p ? p.nombre : ('Producto ' + d.producto_id);
      html += `<tr><td>${name}</td><td>${d.cantidad}</td><td>Bs ${d.precio_unitario}</td></tr>`;
    });
    html += '</table><hr/>';
  });
  // if print=1 is present, include a small script to auto-print when the page loads
  const shouldPrint = req.query && (req.query.print === '1' || req.query.print === 'true');
  if (shouldPrint) {
    html += '<script>window.onload = function(){ window.print(); }</script>';
  }
  html += '</body></html>';
  res.send(html);
});
//END OF SUSAN REPORT

// --- ADD ---
app.post('/usuarios', (req, res) => {
  db.addUsuario(req.body);
  res.json({ status: 'Usuario agregado' });
});
app.post('/ventas', (req, res) => {
  const created = db.addVenta(req.body);
  res.json(created);
});
app.post('/detalles', (req, res) => {
  db.addDetalle(req.body);
  res.json({ status: 'Detalle agregado' });
});
app.post('/productos', (req, res) => {
  db.addProducto(req.body);
  res.json({ status: 'Producto agregado' });
});
app.post('/categorias', (req, res) => {
  db.addCategoria(req.body);
  res.json({ status: 'Categoría agregada' });
});

// --- VERIFICAR USUARIO ---
app.post('/verificarUsuario', (req, res) => {
  const { Nombre, Contra } = req.body;
  const existe = db.verificarUsuario(Nombre, Contra);
  res.json({ existe });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});