# 🧁 A Hornear By Gaby - Sistema de Gestión de Repostería

Un sistema completo para gestionar ingredientes, recetas y cotizaciones para un negocio de repostería artesanal.

## ✨ Características

- 📝 **Gestión de Ingredientes**: Agregar, editar y controlar inventario con precios por unidad
- 🍰 **Recetas**: Crear recetas con cálculo automático de costos basado en ingredientes
- 💰 **Cotizaciones**: Generar presupuestos profesionales con márgenes de ganancia personalizables
- 📱 **Responsive**: Diseño optimizado para móviles y desktop
- 🖼️ **Exportar a Imagen**: Descargar cotizaciones como imágenes de alta calidad
- 👤 **Autenticación**: Sistema seguro de usuarios con Supabase
- 💡 **Edición Rápida**: Editar precios y cantidades directamente en las tablas

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **Backend**: Supabase
- **Autenticación**: Supabase Auth
- **Base de Datos**: PostgreSQL (Supabase)
- **Estilos**: CSS personalizado con variables y tema de panadería
- **Exportación**: html2canvas para generar imágenes
- **Iconos**: Font Awesome

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/by-gaby.git
   cd by-gaby
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Configurar base de datos**
   
   Ejecutar el script SQL en tu consola de Supabase:
   ```bash
   # El archivo database-schema-fixed.sql contiene toda la estructura
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── dashboard/          # Componentes del dashboard
│   │   ├── AgregarCotizacion.jsx
│   │   ├── AgregarIngrediente.jsx
│   │   ├── AgregarReceta.jsx
│   │   ├── EditarIngrediente.jsx
│   │   ├── EditarReceta.jsx
│   │   ├── IngredientsList.jsx
│   │   ├── Navigation.jsx
│   │   ├── QuotesList.jsx
│   │   ├── RecipesList.jsx
│   │   ├── StatsOverview.jsx
│   │   ├── TabNavigation.jsx
│   │   └── VerCotizacion.jsx
│   ├── Dashboard.jsx       # Componente principal
│   ├── Login.jsx          # Autenticación
│   └── Register.jsx       # Registro
├── contexts/
│   └── AuthContext.jsx    # Contexto de autenticación
├── lib/
│   └── supabase.js       # Configuración de Supabase
├── styles/               # Estilos CSS modulares
│   ├── animations.css
│   ├── auth.css
│   ├── base.css
│   ├── buttons.css
│   ├── components.css
│   ├── dashboard.css
│   ├── forms.css
│   ├── modal.css
│   ├── quotes.css
│   ├── responsive.css
│   └── tables.css
└── main.jsx             # Punto de entrada
```

## 📱 Características Móviles

- **Controles Numéricos**: Botones + y - para incrementar/decrementar valores en móviles
- **Tablas Adaptativas**: Las tablas se convierten en tarjetas en dispositivos móviles
- **Navegación por Pestañas**: Optimizada para pantallas pequeñas con iconos
- **Touch-Friendly**: Botones y controles diseñados para interacción táctil

## 💼 Funcionalidades del Negocio

### Gestión de Ingredientes
- Agregar ingredientes con marca, cantidad, unidad y precio
- Cálculo automático de precio por unidad
- Edición rápida de precios y cantidades
- Soporte para múltiples unidades de medida

### Creación de Recetas
- Seleccionar ingredientes de la base de datos
- Especificar cantidades utilizadas
- Cálculo automático del costo total de la receta
- Definir porciones y tipo de tamaño

### Sistema de Cotizaciones
- Crear presupuestos profesionales
- Seleccionar múltiples recetas con cantidades
- Aplicar margen de ganancia personalizable
- Opción de redondear precios hacia arriba
- Exportar como imagen de alta calidad
- Almacemiento de precios fijos (no se actualizan con cambios de ingredientes)

## 🎨 Tema Visual

El diseño utiliza una paleta de colores pasteles inspirada en repostería:
- **Primario**: Rosa pastel (#f8a5c2)
- **Secundario**: Dorado suave (#d4a574)
- **Éxito**: Verde menta (#a3d977)
- **Fuentes**: 
  - Principal: Poppins
  - Marca "A Hornear": Playfair Display
  - Marca "By Gaby": Dancing Script (cursiva)

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio de GitHub a Vercel
2. Configurar variables de entorno en Vercel
3. Desplegar automáticamente

### Netlify
1. Conectar repositorio a Netlify
2. Configurar variables de entorno
3. Configurar comando de build: `npm run build`
4. Directorio de publicación: `dist`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
npm run lint         # Verificar código con ESLint
```

## 🔒 Seguridad

### Variables de Entorno
- ✅ `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son **seguras** para exponerse públicamente
- ❌ **NUNCA** uses `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- 🛡️ Row Level Security (RLS) protege todos los datos de usuario

### Configuración de Seguridad
Todas las tablas tienen:
- **RLS habilitado**: Solo usuarios autenticados pueden acceder a sus datos
- **Políticas restrictivas**: `auth.uid() = user_id` en todas las operaciones
- **Autenticación JWT**: Tokens seguros manejados por Supabase

### ¿Por qué es seguro?
La clave anónima (`anon key`) está diseñada específicamente para uso público:
- Solo permite operaciones definidas en las políticas RLS
- No puede bypasear restricciones de seguridad
- No tiene privilegios administrativos

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autor

**By Gaby** - Sistema de gestión para repostería artesanal

---

💕 **Hecho con amor para el mundo de la repostería artesanal** 🧁