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
    password VARCHAR(100),
    rol VARCHAR(20) NOT NULL DEFAULT 'CLIENTE'
);

INSERT INTO usuario (nombre, email, telefono, password, rol) VALUES
('Administrador', 'admin@papitas.com', '+57 300 000 0000', 'admin123', 'ADMIN');

-- PEDIDO
CREATE TABLE pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100),
    email_cliente VARCHAR(100),
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    metodo_pago VARCHAR(50),
    estado VARCHAR(50),
    total DOUBLE DEFAULT 0,
    fecha_creacion DATETIME,
    fecha_actualizacion DATETIME
);

-- DETALLE PEDIDO
CREATE TABLE detalle_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT,
    subtotal DOUBLE DEFAULT 0,
    producto_id BIGINT,
    pedido_id BIGINT,

    FOREIGN KEY (producto_id) REFERENCES producto(id),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);
