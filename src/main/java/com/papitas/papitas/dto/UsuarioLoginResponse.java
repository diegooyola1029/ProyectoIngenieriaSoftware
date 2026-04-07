package com.papitas.papitas.dto;

import com.papitas.papitas.model.Usuario;

public class UsuarioLoginResponse {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String rol;

    public static UsuarioLoginResponse from(Usuario usuario) {
        UsuarioLoginResponse response = new UsuarioLoginResponse();
        response.id = usuario.getId();
        response.nombre = usuario.getNombre();
        response.email = usuario.getEmail();
        response.telefono = usuario.getTelefono();
        response.rol = usuario.getRol();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getRol() {
        return rol;
    }
}
