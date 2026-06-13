# 💻 TechStore Frontend

Aplicación web desarrollada con **Angular 20** que simula una tienda de tecnología (PCs, Laptops, Componentes) que consume la [TechStore API](https://github.com/billylpz/techstore-api) para gestionar productos, usuarios y órdenes en tiempo real.


# ⚠️ IMPORTANTE
- Este es un **proyecto personal y de portafolio** desarrollado con fines educativos para demostrar habilidades en el desarrollo de una Single Page Application (SPA) robusta con Angular. **No está diseñado ni optimizado para su uso en entornos de producción empresarial.**

- Esta Aplicación Angular ha sido diseñada y optimizada específicamente para actuar como el motor frontend de una aplicación backend (API REST) desarrollada en **Spring Boot** la cual debes descargar o clonar desde (https://github.com/billylpz/techstore-api.git). 

## 🚀 Tecnologías

- 🅰️ Angular v20.0.1
- ⚡ Angular Signals
- 📘 TypeScript
- 🔄 RxJS
- 🎨 Tailwind CSS
- 🌼 DaisyUI
- ⭐ Font Awesome
- 🔐 JWT Decode
- 🌐 Consumo de API REST
- 📝 Reactive Forms


## 🧠 Conceptos aplicados

- **Arquitectura Basada en Servicio**
  - Separación clara de la lógica de negocio y consumo de APIs.

- **Seguridad**
  - Autenticación y autorización basada en roles con JWT.

- **Validación de Datos**
  - Uso de Reactive Forms y Validators de Angular para validación de formularios en tiempo real.

- **Estado Reactivo**
  - Uso de Signals para una detección de cambios eficiente y moderna.

- **Componentes Standalone**
  - Estructura modular sin necesidad de NgModules.

- **Contenerización**
  - Docker + multi-stage builds

- **UI/UX Adaptable**
  - Diseño responsive con soporte nativo para diferentes dispositivos.


## ✨ Funcionalidades

- 🔐 **Autenticación y Autorización**
  - Registro e inicio de sesión de usuarios mediante JWT, con control de acceso basado en roles (Administrador y Cliente).

- 📦 **Gestión de Inventario (Admin)**
  - Dashboard para crear, actualizar y eliminar productos, categorías, marcas y usuarios.
  - Búsqueda y filtrado avanzado:
    - Usuarios por nombre o apellido.
    - Marcas, categorías y productos por nombre y estado.

- 🖼️ **Gestión Multimedia**
  - Subida y eliminación de imágenes para productos integrada con Cloudinary (vía Backend).

- 🛒 **Experiencia de Compra**
  - Visualización de productos con filtros por categoría, marca y precio.
  - Carro de compras intituivo para el usuario.

- 📊 **Paginación Dinámica**
  - Navegación eficiente de los productos.

- 🧾 **Sistema de Órdenes**
  - Procesamiento eficaz de validación para generar compras.

- 📄 **Comprobantes**
  - Descarga de boletas de compra en formato PDF con detalles de la transacción.


# 🖥️ Configuración y Ejecución

Descarga o clona el proyecto desde (https://github.com/billylpz/techstore-app.git)

## ⚠️ IMPORTANTE
Este proyecto requiere que la [TechStore API](https://github.com/billylpz/techstore-api) esté en ejecución para funcionar correctamente, ya sea en local o en docker.


## ▶️ Ejecución en Local:
### ✔️ Requisitos
- **NodeJS:** v22.16.0
- **Angular CLI:** v20.0.1

## 🖥️ Ejecutar proyecto
Ejecutar en la terminal los siguientes comandos en la ruta donde hayas descargado el proyecto:

📌 **Para instalar el paquete node_modules:**
```bash
npm install 
```
📌 **Para ejecutar la aplicación:**
```bash
ng serve -o
```

## 🐳 Ejecución con Docker :
### ✔️ Requisitos
- Docker Desktop
- Crear imagen docker


## 🐳 Construcción de Imagen Docker

- Ejecutar el siguiente comando desde la raíz del proyecto para crear y ejecutar el contenedor docker:

```bash
docker-compose up --build
```

- Una vez creado el contenedor deber ingresar a http://localhost:4200 en tu navegador.



Desarrollado por [Billy López](https://github.com/billylpz)
