package com.papitas.papitas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class PedidoRequest {
    @NotBlank(message = "El nombre del cliente es obligatorio.")
    private String nombreCliente;

    @Email(message = "Ingresa un correo valido.")
    @NotBlank(message = "El correo del cliente es obligatorio.")
    private String emailCliente;

    @NotBlank(message = "La direccion es obligatoria.")
    private String direccion;

    @NotBlank(message = "El telefono es obligatorio.")
    private String telefono;

    @NotBlank(message = "Selecciona un metodo de pago.")
    private String metodoPago;

    @Valid
    @NotEmpty(message = "Selecciona al menos un producto.")
    private List<DetallePedidoRequest> detalles;

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public List<DetallePedidoRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedidoRequest> detalles) {
        this.detalles = detalles;
    }
}
