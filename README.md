# By Gaby - Calculadora de Costos de Recetas

Una aplicación React para el cálculo de costos de recetas y generación de cotizaciones, construida con Vite y Supabase.

## Características

- **Autenticación de Usuario**: Registro e inicio de sesión con email/contraseña
- **Gestión de Ingredientes**: Agregar ingredientes con seguimiento de marca, cantidad y precio
- **Creación de Recetas**: Crear recetas con múltiples ingredientes y cálculo automático de costos
- **Generación de Cotizaciones**: Crear cotizaciones con múltiples recetas para clientes
- **Seguimiento de Costos**: Cálculo automático de costos totales y por porción
- **Panel de Control**: Ver todas las recetas, ingredientes y cotizaciones en un solo lugar
- **Interfaz Moderna**: Diseño limpio y responsivo con colores profesionales

## Instrucciones de Instalación

### 1. Instalar Dependencias

```bash
pnpm install
```

### 2. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En el Editor SQL, ejecuta el contenido de `database-schema.sql` para crear las tablas
3. Copia tu URL del proyecto y clave anónima desde Configuración > API

### 3. Configurar Variables de Entorno

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Actualiza `.env` con tus credenciales de Supabase:
```
VITE_SUPABASE_URL=tu_url_del_proyecto_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_supabase_aqui
```

### 4. Ejecutar el Servidor de Desarrollo

```bash
pnpm start
# o
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Esquema de Base de Datos

La aplicación utiliza las siguientes tablas principales:

- **profiles**: Perfiles de usuario (vinculados a la autenticación de Supabase)
- **ingredients**: Inventario de ingredientes con precios
- **recipes**: Definiciones de recetas con porciones
- **recipe_ingredients**: Relación muchos-a-muchos entre recetas e ingredientes
- **quotes**: Cotizaciones de clientes
- **quote_recipes**: Relación muchos-a-muchos entre cotizaciones y recetas

## Uso

1. **Registrarse/Iniciar Sesión**: Crea una cuenta o inicia sesión con credenciales existentes
2. **Agregar Ingredientes**: Comienza agregando ingredientes con sus cantidades y precios
3. **Crear Recetas**: Construye recetas seleccionando ingredientes y especificando las cantidades utilizadas
4. **Generar Cotizaciones**: Crea cotizaciones para clientes seleccionando múltiples recetas con cantidades
5. **Ver Panel de Control**: Monitorea todos tus datos desde el panel principal

## Cálculos de Costos

- **Costo de Ingrediente**: Calcula automáticamente el precio por unidad (precio/cantidad)
- **Costo de Receta**: Suma todos los costos de ingredientes basados en las cantidades utilizadas
- **Costo de Cotización**: Totaliza múltiples recetas con sus cantidades
- **Por Porción**: Divide el costo total de la receta por el número de porciones

## Funcionalidades de la Interfaz

- **Diseño Responsivo**: Optimizado para dispositivos móviles y escritorio
- **Tema Moderno**: Paleta de colores profesional con degradados
- **Navegación por Pestañas**: Interfaz intuitiva para cambiar entre secciones
- **Tarjetas de Estadísticas**: Resumen visual de tus datos
- **Estados Vacíos**: Mensajes útiles cuando no hay datos
- **Alertas y Confirmaciones**: Feedback claro para las acciones del usuario

## Construir para Producción

```bash
pnpm run build
```

## Tecnologías Utilizadas

- **Frontend**: React 18, Vite
- **Backend**: Supabase (PostgreSQL + Autenticación)
- **Estilos**: CSS Puro con Variables CSS
- **Gestor de Paquetes**: pnpm
- **Base de Datos**: PostgreSQL con triggers automáticos
- **Autenticación**: Supabase Auth con Row Level Security (RLS)