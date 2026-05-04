# 🥔 Papitas Limoncitas — Sistema de Distribución de Snacks

> MVP funcional desarrollado como proyecto de Ingeniería de la Información  
> Universidad de Ibagué · 2025

---

## 📋 Descripción

**Papitas Limoncitas** es un sistema web para la gestión de pedidos y distribución de papas fritas. El MVP permite registrar productos, gestionar pedidos de distribución y visualizar reportes básicos de ventas e inventario.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | 5 | Estructura de la interfaz |
| CSS3 | 3 | Diseño visual y responsive |
| JavaScript | ES2022 | Lógica de negocio y controladores |
| Postman | 11.x | Pruebas automatizadas de API |
| Newman | 6.x | Ejecución CLI de colecciones Postman |
| Git | 2.45.x | Control de versiones |
| Live Server (VSCode) | 5.7.x | Servidor de desarrollo local |

---

## ⚙️ Requisitos del sistema

- **Navegador:** Google Chrome 100+, Firefox 110+ o Microsoft Edge 100+
- **Editor recomendado:** Visual Studio Code 1.89+
- **Extensión recomendada:** Live Server (ritwickdey.liveserver)
- **Herramienta de pruebas:** Postman 11.x + Newman 6.x (opcional, para ejecutar pruebas automatizadas)
- **Git:** versión 2.x o superior

---

## 🚀 Instalación en un nuevo equipo

Sigue estos pasos para clonar y ejecutar el proyecto localmente desde cero:

### 1. Clonar el repositorio

```bash
git clone https://github.com/<usuario>/papitas-limoncitas.git
cd papitas-limoncitas
```

### 2. Abrir en Visual Studio Code

```bash
code .
```

### 3. Ejecutar con Live Server

1. Instala la extensión **Live Server** en VSCode (si aún no la tienes).
2. Haz clic derecho sobre `index.html` → **"Open with Live Server"**.
3. El navegador abrirá automáticamente `http://127.0.0.1:5500/`.

### 4. Ejecución directa (sin Live Server)

También puedes abrir el archivo directamente en el navegador:

```
Archivo → Abrir archivo → index.html
```

> ⚠️ Algunas funciones de fetch/localStorage pueden requerir Live Server para funcionar correctamente por restricciones CORS del navegador.

---

## 📁 Estructura del proyecto

```
papitas-limoncitas/
│
├── index.html              # Página principal (login / dashboard)
├── README.md               # Guía de instalación (este archivo)
│
├── assets/                 # Recursos estáticos
│   ├── img/                # Imágenes y logos
│   └── fonts/              # Fuentes tipográficas
│
├── css/                    # Hojas de estilo
│   ├── main.css            # Estilos globales
│   ├── components.css      # Componentes reutilizables
│   └── responsive.css      # Diseño responsive
│
├── js/                     # Lógica de la aplicación (MVC)
│   ├── app.js              # Punto de entrada principal
│   ├── models/             # Capa Modelo
│   │   ├── Producto.js
│   │   ├── Pedido.js
│   │   └── Usuario.js
│   ├── controllers/        # Capa Controlador
│   │   ├── authCtrl.js
│   │   ├── pedidoCtrl.js
│   │   └── productoCtrl.js
│   └── services/           # Servicios (patrón Facade)
│       ├── SessionManager.js
│       └── PedidoService.js
│
├── pages/                  # Vistas HTML por módulo
│   ├── catalogo.html
│   ├── pedidos.html
│   └── reportes.html
│
└── tests/                  # Pruebas automatizadas
    └── postman/
        ├── papitas_collection.json   # Colección Postman
        └── papitas_environment.json  # Variables de entorno Postman
```

---

## 🧪 Ejecución de Pruebas (Postman + Newman)

### Opción A — Postman (interfaz gráfica)

1. Abre Postman.
2. Importa el archivo `tests/postman/papitas_collection.json`.
3. Importa el archivo `tests/postman/papitas_environment.json` como entorno.
4. Selecciona el entorno **"Papitas Limoncitas Local"**.
5. Ejecuta la colección con **Runner**.

### Opción B — Newman (línea de comandos)

```bash
# Instalar Newman (requiere Node.js)
npm install -g newman

# Ejecutar colección
newman run tests/postman/papitas_collection.json \
  -e tests/postman/papitas_environment.json \
  --reporters cli,json \
  --reporter-json-export tests/resultados.json
```

---

## 🏗️ Arquitectura del proyecto

El proyecto sigue el patrón **MVC (Modelo-Vista-Controlador)**:

| Capa | Componente | Responsabilidad |
|---|---|---|
| **Modelo** | `js/models/` | Datos, validaciones y reglas de negocio |
| **Vista** | `*.html` + `css/` | Interfaz de usuario |
| **Controlador** | `js/controllers/` | Eventos, lógica de interacción y actualización de la vista |

**Patrones de diseño aplicados:**
- **Singleton** → `SessionManager.js` (gestión única de sesión)
- **Facade** → `PedidoService.js` (interfaz simplificada de operaciones)
- **Observer** → Actualización reactiva de la interfaz ante cambios de estado

---

## 👥 Autores

| Nombre | Rol |
|---|---|
| Angel | Desarrollo Frontend & UI/UX |
| Diego Alejandro Oyola | Desarrollo & Pruebas QA |
| Cristian Cardona | Documentación & Gestión de Configuración |

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.  
Desarrollado con fines académicos — Universidad de Ibagué · Ingeniería de la Información · 2025.
