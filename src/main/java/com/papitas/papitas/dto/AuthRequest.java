package com.papitas.papitas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @Email(message = "Ingresa un correo valido.")
    @NotBlank(message = "El correo es obligatorio.")
    private String email;

    @NotBlank(message = "La contrasena es obligatoria.")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
