package com.papitas.papitas.controller;

import com.papitas.papitas.dto.AuthRequest;
import com.papitas.papitas.dto.UsuarioLoginResponse;
import com.papitas.papitas.dto.UsuarioRegistroRequest;
import com.papitas.papitas.repository.UsuarioRepository;
import com.papitas.papitas.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioRepository usuarioRepository, UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public UsuarioLoginResponse registrar(@Valid @RequestBody UsuarioRegistroRequest usuario) {
        return usuarioService.registrar(usuario);
    }

    @PostMapping("/login")
    public UsuarioLoginResponse login(@Valid @RequestBody AuthRequest usuario) {
        return usuarioService.login(usuario);
    }

    @GetMapping
    public List<UsuarioLoginResponse> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioLoginResponse::from).toList();
    }
}
