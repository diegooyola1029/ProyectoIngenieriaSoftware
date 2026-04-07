package com.papitas.papitas.service;

import com.papitas.papitas.dto.AuthRequest;
import com.papitas.papitas.dto.UsuarioLoginResponse;
import com.papitas.papitas.dto.UsuarioRegistroRequest;
import com.papitas.papitas.exception.BusinessException;
import com.papitas.papitas.model.Usuario;
import com.papitas.papitas.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioLoginResponse registrar(UsuarioRegistroRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            throw new BusinessException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        });

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setEmail(email);
        usuario.setTelefono(request.getTelefono().trim());
        usuario.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        usuario.setRol("CLIENTE");

        return UsuarioLoginResponse.from(usuarioRepository.save(usuario));
    }

    public UsuarioLoginResponse login(AuthRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Correo o contrasena incorrectos."));

        String rawPassword = request.getPassword().trim();
        boolean passwordMatches = usuario.getPassword() != null
                && (passwordEncoder.matches(rawPassword, usuario.getPassword()) || usuario.getPassword().equals(rawPassword));

        if (!passwordMatches) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "Correo o contrasena incorrectos.");
        }

        if (usuario.getPassword() != null && !usuario.getPassword().startsWith("$2")) {
            usuario.setPassword(passwordEncoder.encode(rawPassword));
            usuarioRepository.save(usuario);
        }

        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("CLIENTE");
            usuarioRepository.save(usuario);
        }

        return UsuarioLoginResponse.from(usuario);
    }
}
