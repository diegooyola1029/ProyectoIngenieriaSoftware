package com.papitas.papitas.service;

import com.papitas.papitas.dto.DetallePedidoRequest;
import com.papitas.papitas.dto.PedidoRequest;
import com.papitas.papitas.dto.PedidoResponse;
import com.papitas.papitas.exception.BusinessException;
import com.papitas.papitas.model.DetallePedido;
import com.papitas.papitas.model.Pedido;
import com.papitas.papitas.model.Producto;
import com.papitas.papitas.repository.PedidoRepository;
import com.papitas.papitas.repository.ProductoRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {
    private static final List<String> ESTADOS_VALIDOS = List.of("PENDIENTE", "EN_PROCESO", "DESPACHADO", "ENTREGADO");
    private static final int UMBRAL_MAYORISTA = 50;
    private static final double PRECIO_MAYORISTA = 2200;

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaCreacionDesc().stream().map(PedidoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPorUsuario(String emailCliente) {
        return pedidoRepository.findByEmailClienteOrderByFechaCreacionDesc(emailCliente.trim().toLowerCase())
                .stream()
                .map(PedidoResponse::from)
                .toList();
    }

    @Transactional
    public PedidoResponse actualizarEstado(Long id, String estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "No encontramos el pedido solicitado."));

        pedido.setEstado(normalizarEstado(estado));
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse guardar(PedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setNombreCliente(request.getNombreCliente().trim());
        pedido.setEmailCliente(request.getEmailCliente().trim().toLowerCase());
        pedido.setDireccion(request.getDireccion().trim());
        pedido.setTelefono(request.getTelefono().trim());
        pedido.setMetodoPago(request.getMetodoPago().trim());
        pedido.setEstado("PENDIENTE");

        List<DetallePedido> detalles = new ArrayList<>();
        int totalUnidades = request.getDetalles().stream().mapToInt(DetallePedidoRequest::getCantidad).sum();
        boolean aplicaMayorista = totalUnidades >= UMBRAL_MAYORISTA;
        double total = 0;

        for (DetallePedidoRequest detalleRequest : request.getDetalles()) {
            Producto producto = productoRepository.findById(detalleRequest.getProductoId())
                    .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Uno de los productos no existe."));

            if (detalleRequest.getCantidad() <= 0) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, "Todas las cantidades deben ser mayores a cero.");
            }

            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new BusinessException(
                        HttpStatus.BAD_REQUEST,
                        "No hay stock suficiente para " + producto.getNombre() + ". Disponibles: " + producto.getStock() + "."
                );
            }

            producto.setStock(producto.getStock() - detalleRequest.getCantidad());
            productoRepository.save(producto);

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleRequest.getCantidad());
            double precioAplicado = aplicaMayorista ? PRECIO_MAYORISTA : producto.getPrecio();
            detalle.setSubtotal(detalleRequest.getCantidad() * precioAplicado);
            detalles.add(detalle);
            total += detalle.getSubtotal();
        }

        pedido.setDetalles(detalles);
        pedido.setTotal(total);

        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    private String normalizarEstado(String estado) {
        String value = estado == null ? "" : estado.trim().toUpperCase();
        if (!ESTADOS_VALIDOS.contains(value)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "El estado enviado no es valido.");
        }
        return value;
    }
}
