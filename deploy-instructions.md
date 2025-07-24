# 🚀 Instrucciones de Despliegue - By Gaby

## Paso 1: Preparar el repositorio local

1. **Inicializar git** (si no está inicializado):
   ```bash
   git init
   ```

2. **Agregar archivos al staging**:
   ```bash
   git add .
   ```

3. **Hacer el primer commit**:
   ```bash
   git commit -m "Initial commit: By Gaby bakery management system"
   ```

## Paso 2: Crear repositorio en GitHub

1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre del repositorio: `by-gaby` (o el que prefieras)
4. Descripción: "Sistema de gestión para repostería artesanal"
5. Mantén como público o privado según prefieras
6. **NO** inicialices con README, .gitignore o license (ya los tenemos)
7. Haz clic en "Create repository"

## Paso 3: Conectar y subir al repositorio

1. **Agregar el remote origin**:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/by-gaby.git
   ```

2. **Verificar el remote**:
   ```bash
   git remote -v
   ```

3. **Subir el código**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Paso 4: Desplegar en Vercel (Recomendado)

### Opción A: Desde GitHub
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New Project"
4. Selecciona tu repositorio `by-gaby`
5. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`: Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase
6. Haz clic en "Deploy"

### Opción B: Desde CLI
1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Hacer login**:
   ```bash
   vercel login
   ```

3. **Desplegar**:
   ```bash
   vercel
   ```

4. **Configurar variables de entorno**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

5. **Redesplegar con las variables**:
   ```bash
   vercel --prod
   ```

## Paso 5: Desplegar en Netlify (Alternativa)

1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Add new site" > "Import an existing project"
3. Conecta con GitHub y selecciona tu repositorio
4. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Variables de entorno:
   - `VITE_SUPABASE_URL`: Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase
6. Haz clic en "Deploy site"

## Paso 6: Configurar dominio personalizado (Opcional)

### Para Vercel:
1. Ve a tu proyecto en Vercel
2. Settings > Domains
3. Agrega tu dominio personalizado

### Para Netlify:
1. Ve a tu sitio en Netlify
2. Site settings > Domain management
3. Agrega tu dominio personalizado

## Paso 7: Configurar CI/CD (Automático)

Ambas plataformas configuran automáticamente:
- **Deploy automático** cuando haces push a `main`
- **Deploy previews** para pull requests
- **Rollback** fácil a versiones anteriores

## 🔧 Comandos útiles para desarrollo continuo

```bash
# Trabajar en una nueva feature
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "Add: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Hacer merge a main
git checkout main
git merge feature/nueva-funcionalidad
git push origin main  # Esto desplegará automáticamente

# Ver el estado del repositorio
git status
git log --oneline
```

## 📱 URLs de ejemplo

- **Desarrollo local**: `http://localhost:5173`
- **Vercel**: `https://by-gaby.vercel.app`
- **Netlify**: `https://by-gaby.netlify.app`

## 🔐 Variables de entorno requeridas

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-muy-larga
```

## ✅ Checklist final

- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas
- [ ] Sitio desplegado y funcionando
- [ ] Base de datos Supabase configurada
- [ ] Dominio personalizado (opcional)
- [ ] SSL habilitado (automático)

¡Tu sistema By Gaby está listo para producción! 🎉
