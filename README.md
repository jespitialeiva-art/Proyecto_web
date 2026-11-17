
# StockPhoto Explorer

Aplicación web desarrollada con **React, Vite y Tailwind CSS** que permite buscar y descargar fotografías gratuitas mediante la API de Unsplash, además de visualizar la ubicación geográfica donde fueron capturadas utilizando Google Maps.

## Tecnologías utilizadas

- React + Vite
- JavaScript (JSX)
- Tailwind CSS
- Unsplash API
- Google Maps JavaScript API

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jespitialeiva-art/Proyecto_web.git
```

### 2. Acceder al proyecto

```bash
cd Proyecto_web
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto y agregar:

```env
VITE_UNSPLASH_ACCESS_KEY=TU_ACCESS_KEY
VITE_GOOGLE_MAPS_API_KEY=TU_GOOGLE_MAPS_API_KEY
```

Las claves deben obtenerse desde:

- [Unsplash Developers](https://unsplash.com/developers)
- [Google Cloud Console](https://console.cloud.google.com/)

**Nota:** Para visualizar los mapas, se debe habilitar Google Maps JavaScript API y configurar las restricciones correspondientes.

### 5. Ejecutar la aplicación

```bash
npm run dev
```

Abrir en el navegador:

http://localhost:5173/

## Créditos

Las fotografías son proporcionadas por [Unsplash](https://unsplash.com/).

Los mapas se visualizan mediante [Google Maps Platform](https://developers.google.com/maps).
