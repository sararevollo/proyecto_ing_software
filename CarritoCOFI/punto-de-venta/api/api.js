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

// --- ADD ---
app.post('/usuarios', (req, res) => {
  db.addUsuario(req.body);
  res.json({ status: 'Usuario agregado' });
});
app.post('/ventas', (req, res) => {
  db.addVenta(req.body);
  res.json({ status: 'Venta agregada' });
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