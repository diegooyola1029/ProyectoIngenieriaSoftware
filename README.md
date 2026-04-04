# Sistema de Gestión de Pedidos – Papitas Limoncitas

## 1. Descripción del Proyecto

El presente proyecto consiste en el desarrollo de un sistema de información orientado a optimizar el proceso de gestión de pedidos y atención al cliente de la empresa *Papitas Limoncitas*, ubicada en la ciudad de Ibagué.

Actualmente, el negocio gestiona sus pedidos a través de múltiples canales de comunicación, lo que genera inconsistencias en la información, retrasos en la atención y dificultades en el control del inventario. En respuesta a esta problemática, se propone una solución tecnológica que permita centralizar la información, automatizar procesos y mejorar la eficiencia operativa.

El sistema desarrollado permite a los usuarios consultar productos disponibles, seleccionar múltiples opciones de compra y registrar pedidos de manera estructurada, facilitando la administración y seguimiento de los mismos.

---

## 2. Objetivo General

Desarrollar un sistema de información que permita optimizar la gestión de pedidos y mejorar el proceso de atención al cliente en la empresa Papitas Limoncitas.

---

## 3. Objetivos Específicos

* Analizar los requerimientos del negocio mediante técnicas de levantamiento de información.
* Diseñar la arquitectura del sistema de acuerdo con las necesidades identificadas.
* Implementar una solución tecnológica para la gestión de pedidos.
* Mejorar la organización de la información y el control del inventario.
* Facilitar la interacción entre el cliente y la empresa mediante una interfaz intuitiva.

---

## 4. Información de la Empresa

* **Nombre:** Papitas Limoncitas
* **Ubicación:** Ibagué, Colombia

### Misión

Ofrecer un producto de calidad que sea reconocido en la ciudad, facilitando su adquisición mediante procesos accesibles y eficientes.

### Visión

Consolidarse como una empresa competitiva mediante la implementación de soluciones tecnológicas que optimicen sus procesos y mejoren la experiencia del cliente.

---

## 5. Tecnologías Utilizadas

### Backend

* Java
* Spring Boot
* Spring Data JPA

### Frontend

* HTML
* CSS
* JavaScript

### Base de Datos

* MySQL

### Herramientas de Desarrollo

* Git
* GitHub
* Visual Studio Code
* MySQL Workbench

---

## 6. Funcionalidades del Sistema

El sistema implementa las siguientes funcionalidades:

* Registro y autenticación de usuarios.
* Visualización de productos disponibles (sabores).
* Selección de múltiples productos por pedido.
* Cálculo automático del valor total de la compra.
* Registro y almacenamiento de pedidos.
* Control de inventario (stock) en tiempo real.
* Gestión del estado de los pedidos.
* Panel administrativo para seguimiento de pedidos.

---

## 7. Arquitectura del Sistema

El sistema se desarrolla bajo una arquitectura cliente-servidor:

* **Frontend:** Interfaz web accesible desde navegador.
* **Backend:** API REST desarrollada en Spring Boot.
* **Base de datos:** MySQL para almacenamiento persistente.

---

## 8. Estructura del Proyecto

```
papitas/
│── src/
│   ├── main/java/com/papitas/papitas/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── PapitasApplication.java
│   ├── resources/
│   │   ├── static/
│   │   │   ├── index.html
│   │   │   ├── login.html
│   │   │   ├── registro.html
│   │   │   ├── admin.html
│   │   └── application.properties
│── database.sql
│── pom.xml
```

---

## 9. Configuración de la Base de Datos

Para la correcta ejecución del sistema, es necesario configurar la base de datos:

1. Crear una base de datos en MySQL.
2. Ejecutar el archivo:

```
database.sql
```

Este script crea las siguientes tablas:

* producto
* usuario
* pedido
* detalle_pedido

---

## 10. Ejecución del Proyecto

### Clonar el repositorio

```bash
git clone https://github.com/diegooyola1029/ProyectoIngenieriaSoftware.git
```

### Configurar credenciales de base de datos

Editar el archivo:

```
application.properties
```

### Ejecutar la aplicación

```bash
mvn spring-boot:run
```

### Acceder al sistema

```
http://localhost:8081
```

---

## 11. Metodología de Desarrollo

El proyecto fue desarrollado bajo la metodología ágil Scrum, permitiendo una gestión iterativa del desarrollo, facilitando la adaptación a cambios y el seguimiento continuo del progreso.

---

## 12. Equipo de Trabajo

* **Product Owner:** Diego Alejandro Oyola Padilla
* **Scrum Master:** Ángel David Arenales
* **Desarrollador:** Juan Camilo Liberato

---

## 13. Estado del Proyecto

El sistema se encuentra en una fase funcional, con implementación completa de:

* Backend
* Frontend
* Base de datos
* Gestión de pedidos

---

## 14. Mejoras Futuras

* Integración de pasarelas de pago.
* Implementación de notificaciones en tiempo real.
* Desarrollo de aplicación móvil.
* Despliegue en infraestructura en la nube.
* Implementación de seguridad avanzada (JWT).

---

## 15. Naturaleza del Proyecto

Este proyecto ha sido desarrollado como parte de un proceso académico en el área de Ingeniería de Sistemas, aplicando conocimientos en análisis, diseño e implementación de soluciones tecnológicas orientadas a resolver problemáticas reales en entornos empresariales.

---



