package com.papitas.papitas.repository;

import com.papitas.papitas.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findAllByOrderByNombreAsc();
}
