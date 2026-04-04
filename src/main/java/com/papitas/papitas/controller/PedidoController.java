package com.papitas.papitas.controller;

import com.papitas.papitas.model.*;
import com.papitas.papitas.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin("*")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoController(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    @PutMapping("/{id}/estado")
    public Pedido actualizarEstado(@PathVariable Long id, @RequestBody Pedido p) {
        Pedido pedido = pedidoRepository.findById(id).orElseThrow();
        pedido.setEstado(p.getEstado());
        return pedidoRepository.save(pedido);
    }

    @PostMapping
    public Pedido guardar(@RequestBody Pedido pedido) {

        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new RuntimeException("No enviaste productos ❌");
        }

        for (DetallePedido d : pedido.getDetalles()) {

            Producto producto = productoRepository
                    .findById(d.getProducto().getId())
                    .orElseThrow();

            if (producto.getStock() < d.getCantidad()) {
                throw new RuntimeException("Sin stock ❌");
            }

            producto.setStock(producto.getStock() - d.getCantidad());
            productoRepository.save(producto);

            d.setPedido(pedido); // 🔥 IMPORTANTE
        }

        return pedidoRepository.save(pedido);
    }
}