package com.papitas.papitas.controller;

import com.papitas.papitas.model.Producto;
import com.papitas.papitas.repository.ProductoRepository;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producto> listar() {
        return repo.findAllByOrderByNombreAsc();
    }

    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return repo.save(producto);
    }
}
