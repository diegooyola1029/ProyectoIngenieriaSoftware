package com.papitas.papitas.dto;

import com.papitas.papitas.model.DetallePedido;
import com.papitas.papitas.model.Pedido;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoResponse {
    private Long id;
    private String nombreCliente;
    private String emailCliente;
    private String direccion;
    private String telefono;
    private String metodoPago;
    private String estado;
    private double total;
    private int totalUnidades;
    private boolean mayorista;
    private LocalDateTime fechaCreacion;
    private List<PedidoDetalleResponse> detalles;

    public static PedidoResponse from(Pedido pedido) {
        PedidoResponse response = new PedidoResponse();
        response.id = pedido.getId();
        response.nombreCliente = pedido.getNombreCliente();
        response.emailCliente = pedido.getEmailCliente();
        response.direccion = pedido.getDireccion();
        response.telefono = pedido.getTelefono();
        response.metodoPago = pedido.getMetodoPago();
        response.estado = pedido.getEstado();
        response.total = pedido.getTotal();
        response.totalUnidades = pedido.getDetalles().stream().mapToInt(DetallePedido::getCantidad).sum();
        response.mayorista = response.totalUnidades >= 50;
        response.fechaCreacion = pedido.getFechaCreacion();
        response.detalles = pedido.getDetalles().stream().map(PedidoDetalleResponse::from).toList();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public String getEstado() {
        return estado;
    }

    public double getTotal() {
        return total;
    }

    public int getTotalUnidades() {
        return totalUnidades;
    }

    public boolean isMayorista() {
        return mayorista;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public List<PedidoDetalleResponse> getDetalles() {
        return detalles;
    }

    public static class PedidoDetalleResponse {
        private Long productoId;
        private String productoNombre;
        private int cantidad;
        private double precioUnitario;
        private double subtotal;

        public static PedidoDetalleResponse from(DetallePedido detalle) {
            PedidoDetalleResponse response = new PedidoDetalleResponse();
            response.productoId = detalle.getProducto().getId();
            response.productoNombre = detalle.getProducto().getNombre();
            response.cantidad = detalle.getCantidad();
            response.precioUnitario = detalle.getProducto().getPrecio();
            response.subtotal = detalle.getSubtotal();
            return response;
        }

        public Long getProductoId() {
            return productoId;
        }

        public String getProductoNombre() {
            return productoNombre;
        }

        public int getCantidad() {
            return cantidad;
        }

        public double getPrecioUnitario() {
            return precioUnitario;
        }

        public double getSubtotal() {
            return subtotal;
        }
    }
}
