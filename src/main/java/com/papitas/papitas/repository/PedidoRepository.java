package com.papitas.papitas.repository;

import com.papitas.papitas.model.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findAllByOrderByFechaCreacionDesc();

    List<Pedido> findByEmailClienteOrderByFechaCreacionDesc(String emailCliente);
}
