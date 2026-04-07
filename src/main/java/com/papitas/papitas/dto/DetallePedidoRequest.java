package com.papitas.papitas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class DetallePedidoRequest {
    @NotNull(message = "El producto es obligatorio.")
    private Long productoId;

    @Min(value = 1, message = "La cantidad debe ser mayor a cero.")
    private int cantidad;

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
