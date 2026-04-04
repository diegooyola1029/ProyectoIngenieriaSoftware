CREATE DATABASE papitas;
USE papitas;

-- PRODUCTO
CREATE TABLE producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DOUBLE,
    stock INT
);

INSERT INTO producto (nombre, precio, stock) VALUES
('Limon', 3000, 50),
('Limon BBQ', 3000, 50),
('Miel BBQ', 3000, 50),
('Tocineta', 3000, 50),
('Pimienta', 3000, 50);

-- USUARIO
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    password VARCHAR(100)
);

-- PEDIDO
CREATE TABLE pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100),
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    metodo_pago VARCHAR(50),
    estado VARCHAR(50)
);

-- DETALLE PEDIDO
CREATE TABLE detalle_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT,
    producto_id BIGINT,
    pedido_id BIGINT,

    FOREIGN KEY (producto_id) REFERENCES producto(id),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);