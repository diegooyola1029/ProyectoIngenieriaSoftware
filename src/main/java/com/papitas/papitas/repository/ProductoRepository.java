package com.papitas.papitas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.papitas.papitas.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
