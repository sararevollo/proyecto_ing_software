using Newtonsoft.Json;
using PuntoDeVentaWPF.Models;
using PuntoDeVentaWPF.Services;
using PuntoDeVentaWPF.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace PuntoDeVentaWPF
{
    public partial class MainWindow : Window
    {
        private readonly string API_URL = "http://localhost:3000";
        private readonly Carrito _carrito;

        public MainWindow()
        {
            InitializeComponent();
            _carrito = new Carrito(API_URL);
            RefreshCarritoGrid();
        }

        private async void BtnMostrarCategorias_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var http = new System.Net.Http.HttpClient();
                var resp = await http.GetAsync($"{API_URL}/categorias");
                resp.EnsureSuccessStatusCode();
                var cjson = await resp.Content.ReadAsStringAsync();
                var categorias = JsonConvert.DeserializeObject<List<Categoria>>(cjson);
                GridCategorias.ItemsSource = categorias;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"No se pudieron obtener las categorías:\n{ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void BtnAgregarProducto_Click(object sender, RoutedEventArgs e)
        {
            // pedir id
            var tecladoId = new TecladoWindow("ID del producto") { Owner = this };
            if (tecladoId.ShowDialog() != true) return;
            if (!int.TryParse(tecladoId.Resultado, out int idProducto) || idProducto <= 0)
            {
                MessageBox.Show("ID inválido.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            // pedir cantidad
            var tecladoCantidad = new TecladoWindow("Cantidad") { Owner = this };
            if (tecladoCantidad.ShowDialog() != true) return;
            if (!int.TryParse(tecladoCantidad.Resultado, out int cantidad) || cantidad <= 0)
            {
                MessageBox.Show("Cantidad inválida.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            var (ok, result) = await _carrito.AgregarProductoAsync(idProducto, cantidad);
            if (!ok)
            {
                MessageBox.Show(result.ToString(), "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            RefreshCarritoGrid();
        }

        private async void BtnEscanear_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var productos = await _carrito.ObtenerTodosProductosAsync();
                if (productos == null || !productos.Any())
                {
                    MessageBox.Show("No hay productos en la base de datos.", "Escanear", MessageBoxButton.OK, MessageBoxImage.Information);
                    return;
                }
                var rnd = new Random();
                var producto = productos[rnd.Next(productos.Count)];
                var (ok, res) = await _carrito.AgregarProductoAsync(producto.producto_id, 1);
                if (ok)
                {
                    MessageBox.Show($"Producto agregado: {producto.nombre}", "Escanear", MessageBoxButton.OK, MessageBoxImage.Information);
                    RefreshCarritoGrid();
                }
                else
                {
                    MessageBox.Show(res.ToString(), "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"No se pudo escanear producto:\n{ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnEliminar_Click(object sender, RoutedEventArgs e)
        {
            if (GridCarrito.SelectedItem == null)
            {
                MessageBox.Show("Seleccione un producto del carrito para eliminar.", "Eliminar", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            dynamic row = GridCarrito.SelectedItem;
            int index = row.Index;
            var (ok, msg) = _carrito.EliminarProducto(index);
            if (ok)
            {
                RefreshCarritoGrid();
            }
            else
            {
                MessageBox.Show(msg, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void BtnIniciarPago_Click(object sender, RoutedEventArgs e)
        {
            var (ok, msg) = await _carrito.IniciarPagoAsync();
            if (ok)
            {
                MessageBox.Show(msg, "Pago", MessageBoxButton.OK, MessageBoxImage.Information);
                _carrito.Vaciar();
                RefreshCarritoGrid();
            }
            else
            {
                MessageBox.Show(msg, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnMostrarTicket_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Open the report in the default browser and request print
                var url = $"{API_URL}/report/ventas?print=1";
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"No se pudo abrir el reporte: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void RefreshCarritoGrid()
        {
            var view = _carrito.Items.Select((p, idx) => new
            {
                Index = idx + 1,
                p.nombre,
                precio = p.precio.ToString("F2"),
                tipo = string.IsNullOrEmpty(p.tipo) ? "general" : p.tipo,
                cantidad = p.cantidad,
                TotalItem = (p.precio * (p.cantidad > 0 ? p.cantidad : 1)).ToString("F2")
            }).ToList();

            GridCarrito.ItemsSource = view;
            LblSubtotal.Text = $"Subtotal: Bs {_carrito.Subtotal:F2}";
            LblTotal.Text = $"Total: Bs {_carrito.Total:F2}";
        }
    }
}
