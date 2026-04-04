package com.papitas.papitas.controller;

import com.papitas.papitas.model.Usuario;
import com.papitas.papitas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🔐 REGISTRO
    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {

        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail());

        if (existente.isPresent()) {
            throw new RuntimeException("El usuario ya existe ❌");
        }

        return usuarioRepository.save(usuario);
    }

    // 🔑 LOGIN
    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {

        Optional<Usuario> user = usuarioRepository.findByEmail(usuario.getEmail());

        if (user.isPresent() && user.get().getPassword().equals(usuario.getPassword())) {
            return user.get();
        } else {
            throw new RuntimeException("Credenciales incorrectas ❌");
        }
    }

    // 👨‍💼 LISTAR USUARIOS (para admin)
    @GetMapping
    public Iterable<Usuario> listar() {
        return usuarioRepository.findAll();
    }
}