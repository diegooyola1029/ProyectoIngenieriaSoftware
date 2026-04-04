package com.papitas.papitas.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.papitas.papitas.model.Producto;
import com.papitas.papitas.repository.ProductoRepository;

@RestController
@CrossOrigin
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producto> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return repo.save(producto);
    }
}
