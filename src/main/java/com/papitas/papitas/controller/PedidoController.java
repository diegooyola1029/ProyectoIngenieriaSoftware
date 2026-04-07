package com.papitas.papitas.controller;

import com.papitas.papitas.dto.EstadoPedidoRequest;
import com.papitas.papitas.dto.PedidoRequest;
import com.papitas.papitas.dto.PedidoResponse;
import com.papitas.papitas.service.PedidoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<PedidoResponse> listar() {
        return pedidoService.listarTodos();
    }

    @GetMapping("/usuario/{email}")
    public List<PedidoResponse> listarPorUsuario(@PathVariable String email) {
        return pedidoService.listarPorUsuario(email);
    }

    @PutMapping("/{id}/estado")
    public PedidoResponse actualizarEstado(@PathVariable Long id, @Valid @RequestBody EstadoPedidoRequest request) {
        return pedidoService.actualizarEstado(id, request.getEstado());
    }

    @PostMapping
    public PedidoResponse guardar(@Valid @RequestBody PedidoRequest pedido) {
        return pedidoService.guardar(pedido);
    }
}
