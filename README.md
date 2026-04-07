# Papitas Limoncitas

Sistema web de pedidos para **Papitas Limoncitas**, construido con **Spring Boot + MySQL + HTML/CSS/JavaScript**, enfocado en una experiencia moderna tipo app, flujo de compra claro y panel administrativo para seguimiento operativo.

## Demo del proyecto

El sistema incluye:

- Tienda visual tipo app con branding de la marca
- Login y registro de usuarios
- Carrito dinámico con persistencia en `localStorage`
- Resumen y confirmación de pedido
- Historial de pedidos por usuario
- Compra al por mayor con precio automático
- Panel admin con dashboard, estados e inventario
- Notificación automática de nuevos pedidos por polling

## Funcionalidades principales

### Cliente

- Registro e inicio de sesión
- Visualización de productos con imagen, precio y stock
- Búsqueda de sabores
- Carrito dinámico
- Cálculo de total en tiempo real
- Confirmación antes de enviar pedido
- Pantalla de éxito
- Historial de pedidos
- Sección de compra mayorista

### Administrador

- Dashboard con métricas principales
- Lista de pedidos
- Cambio de estado de pedidos:
  - `PENDIENTE`
  - `EN_PROCESO`
  - `DESPACHADO`
  - `ENTREGADO`
- Alertas de stock bajo
- Monitoreo automático de nuevos pedidos

## Compra al por mayor

El sistema activa automáticamente modo mayorista cuando el pedido alcanza **50 unidades o más**.

- Precio mayorista: **$2200** por unidad
- Precio sugerido de venta: **$3000** por unidad
- El total se recalcula automáticamente en frontend y backend

## Stack tecnológico

- **Backend:** Java, Spring Boot, Spring MVC, Spring Data JPA
- **Base de datos:** MySQL
- **Frontend:** HTML, CSS, JavaScript Vanilla
- **Seguridad básica:** BCrypt para contraseñas
- **Build tool:** Maven Wrapper

## Estructura del proyecto

```text
src/
  main/
    java/com/papitas/papitas/
      controller/
      dto/
      exception/
      model/
      repository/
      service/
    resources/
      static/
        assets/
        admin.html
        admin.js
        index.html
        index.js
        login.html
        login.js
        registro.html
        registro.js
        shared.js
        styles.css
      application.properties
database.sql
pom.xml
README.md
```

## Requisitos

- Java 17+ o compatible con tu entorno Maven/Spring Boot
- Maven (o usar `mvnw` / `mvnw.cmd`)
- MySQL

## Configuración local

### 1. Crear la base de datos

Puedes usar el script:

```sql
SOURCE database.sql;
```

O ejecutar manualmente el contenido de [database.sql](/c:/Users/diego/Downloads/papitas/database.sql).

### 2. Configurar credenciales

Edita [application.properties](/c:/Users/diego/Downloads/papitas/src/main/resources/application.properties) con tus datos locales de MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/papitas
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

server.port=8081
```

## Ejecución local

### En Windows

```bash
./mvnw.cmd spring-boot:run
```

### En macOS/Linux

```bash
./mvnw spring-boot:run
```

Luego abre:

- Tienda: `http://localhost:8081/index.html`
- Login: `http://localhost:8081/login.html`
- Admin: `http://localhost:8081/admin.html`

## Usuario administrador

Si tu base no tiene un administrador, puedes crear uno con:

```sql
USE papitas;

INSERT INTO usuario (nombre, email, telefono, password, rol)
VALUES ('Administrador', 'admin@papitas.com', '3105999230', 'admin123', 'ADMIN');
```

Nota:

- El sistema acepta cuentas heredadas con contraseña en texto plano y las migra a BCrypt al iniciar sesión.

## Pruebas

Ejecuta:

```bash
./mvnw.cmd test
```

## Endpoints principales

### Usuarios

- `POST /usuarios/registro`
- `POST /usuarios/login`
- `GET /usuarios`

### Productos

- `GET /productos`
- `POST /productos`

### Pedidos

- `GET /pedidos`
- `GET /pedidos/usuario/{email}`
- `POST /pedidos`
- `PUT /pedidos/{id}/estado`

## Características técnicas destacadas

- DTOs para entrada y salida de datos
- Manejo global de errores con `@RestControllerAdvice`
- Capa de servicios separada
- Validaciones backend con Bean Validation
- Persistencia JPA
- Cálculo mayorista duplicado en backend para evitar inconsistencias
- Carrito persistente con `localStorage`

## Branding y activos visuales

Los recursos visuales de la marca están en:

- [assets](/c:/Users/diego/Downloads/papitas/src/main/resources/static/assets)

Incluyen:

- logo oficial
- fotos reales del producto
- branding visual usado en la tienda y el panel admin

## Despliegue

La forma más simple de desplegar este proyecto es:

- **Backend + frontend juntos:** Render
- **Base de datos:** Railway / MySQL externo

Para producción, se recomienda:

- mover credenciales a variables de entorno
- configurar `spring.datasource.*` con valores externos
- usar una URL pública para el backend si separas frontend y backend

## Repositorio

Repositorio remoto actual:

- `https://github.com/diegooyola1029/ProyectoIngenieriaSoftware.git`

## Autor

Proyecto desarrollado para **Papitas Limoncitas** como sistema de pedidos con enfoque profesional, visual y comercial.
