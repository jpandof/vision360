# Vision360 - React Clean Architecture App

Una aplicación React moderna con TypeScript, arquitectura limpia por features y un sistema de pestañas dinámico.

## 🚀 Características

- **Arquitectura Limpia**: Organizada por features con separación clara de responsabilidades
- **UI Moderna**: Interfaz construida con shadcn/ui y Tailwind CSS
- **Estado Global**: Nanostores para manejo de estado sin prop drilling
- **Routing Lazy**: Carga perezosa de componentes con React Router
- **Data Fetching**: TanStack Query para manejo eficiente de datos
- **Testing**: Configuración completa con Vitest y React Testing Library
- **Code Quality**: ESLint, Prettier y TypeScript configurados

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes compartidos
│   ├── ui/             # Componentes de UI (shadcn/ui)
│   └── layout/         # Componentes de layout
├── features/           # Features organizadas por dominio
│   ├── dashboard/      # Feature de dashboard
│   ├── users/          # Feature de usuarios
│   └── settings/       # Feature de configuración
├── stores/             # Estado global con Nanostores
├── router/             # Configuración de rutas
├── lib/                # Utilidades y helpers
└── test/               # Configuración de tests
```

## 🛠️ Tecnologías

- **React 18** + **TypeScript**
- **Vite** - Build tool y dev server
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Styling
- **Nanostores** - Estado global
- **React Router** - Routing con lazy loading
- **TanStack Query** - Data fetching y caching
- **Vitest** + **React Testing Library** - Testing
- **ESLint** + **Prettier** - Code quality

## 🚦 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Tests
npm run test
npm run test:ui
npm run test:coverage

# Linting y Formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## 🎯 Features Implementadas

### 1. Dashboard
- Vista principal con métricas y estadísticas
- Cards informativos con iconos
- Layout responsive

### 2. Users
- Lista de usuarios con TanStack Query
- Estados de loading y error
- Interfaz para gestión de usuarios

### 3. Settings
- Configuración de tema (light/dark/system)
- Uso de Nanostores para estado global
- Persistencia en localStorage

### 4. Sistema de Pestañas
- Navegación por pestañas dinámicas
- Posibilidad de cerrar pestañas
- Estado persistente de pestañas abiertas

## 🏗️ Arquitectura

### Clean Architecture por Features
Cada feature está organizada con:
- `components/` - Componentes específicos de la feature
- `__tests__/` - Tests de la feature
- Separación clara de responsabilidades

### Estado Global con Nanostores
- `navigation.ts` - Estado de navegación y pestañas
- `theme.ts` - Estado del tema de la aplicación
- Sin prop drilling, estado reactivo

### Routing Lazy
- Carga perezosa de componentes
- Code splitting automático
- Fallbacks de loading

## 🧪 Testing

Tests configurados para:
- Componentes con React Testing Library
- Stores con Vitest
- Cobertura de código
- Mocks para APIs y localStorage

## 🎨 UI/UX

- **Sidebar colapsable** con navegación principal
- **Sistema de pestañas** para múltiples vistas
- **Tema adaptable** (light/dark/system)
- **Componentes accesibles** con shadcn/ui
- **Responsive design** para todos los dispositivos

## 📝 Ejemplos de Uso

### Agregar una nueva feature

1. Crear directorio en `src/features/nueva-feature/`
2. Implementar componentes en `components/`
3. Agregar ruta en `src/router/index.tsx`
4. Actualizar navegación en `src/components/layout/Sidebar.tsx`

### Usar estado global

```tsx
import { useStore } from '@nanostores/react'
import { $theme, setTheme } from '@/stores/theme'

const MyComponent = () => {
  const theme = useStore($theme)
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {theme}
    </button>
  )
}
```

### Data fetching con TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query'

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      const response = await fetch('/api/data')
      return response.json()
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{JSON.stringify(data)}</div>
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -am 'Add nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para más detalles.