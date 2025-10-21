const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    // si no existe, inicializa con estructura vacía
    const init = {
      usuarios: [],
      ventas: [],
      detalles: [],
      productos: [],
      categorias: []
    };
    writeDB(init);
    return init;
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// --- GET ALL ---
function getAllUsuarios() { return readDB().usuarios; }
function getAllVentas() { return readDB().ventas; }
function getAllDetalles() { return readDB().detalles; }
function getAllProductos() { return readDB().productos; }
function getAllCategorias() { return readDB().categorias; }

// --- GET BY ID ---
function getUsuarioById(id) { return readDB().usuarios.find(u => u.Usuario_id === id); }
function getVentaById(id) { return readDB().ventas.find(v => v.Venta_id === id); }
function getDetalleById(id) { return readDB().detalles.find(d => d.detalles_id === id); }
function getProductoById(id) { return readDB().productos.find(p => p.producto_id === id); }
function getCategoriaById(id) { return readDB().categorias.find(c => c.categoria_id === id); }

// --- ADD ---
function addUsuario(usuario) { const db = readDB(); db.usuarios.push(usuario); writeDB(db); }
function addVenta(venta) { const db = readDB(); db.ventas.push(venta); writeDB(db); }
function addDetalle(detalle) { const db = readDB(); db.detalles.push(detalle); writeDB(db); }
function addProducto(producto) { const db = readDB(); db.productos.push(producto); writeDB(db); }
function addCategoria(categoria) { const db = readDB(); db.categorias.push(categoria); writeDB(db); }

// --- VERIFICAR USUARIO ---
function verificarUsuario(nombre, contra) {
  const db = readDB();
  return db.usuarios.some(u => u.Nombre === nombre && u.Contra === contra);
}

module.exports = {
  getAllUsuarios,
  getAllVentas,
  getAllDetalles,
  getAllProductos,
  getAllCategorias,
  getUsuarioById,
  getVentaById,
  getDetalleById,
  getProductoById,
  getCategoriaById,
  addUsuario,
  addVenta,
  addDetalle,
  addProducto,
  addCategoria,
  verificarUsuario
};