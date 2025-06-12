# Mini Panel de E-commerce

Panel de administración moderno para gestión de productos de e-commerce, desarrollado con React, TypeScript, Redux Toolkit y Styled Components.

## 🚀 Características Principales

### Gestión de Productos
- ✅ Listado de productos en grid responsive
- ✅ Añadir nuevo producto (modal/formulario)
- ✅ Editar producto existente
- ✅ Eliminar producto con confirmación
- ✅ Vista detallada de productos

### Filtrado y Búsqueda
- ✅ Búsqueda por nombre de producto
- ✅ Filtrado por categoría
- ✅ Filtrado por rango de precio
- ✅ Filtrado por disponibilidad de stock

### Estados de la Aplicación
- ✅ Estados de carga durante operaciones asíncronas
- ✅ Manejo de errores con mensajes informativos
- ✅ Confirmaciones de éxito para las acciones
- ✅ Diseño completamente responsive

### Funcionalidades Extra Implementadas
- ✅ Persistencia en LocalStorage con seguridad de tipos
- ✅ Animaciones y transiciones con Framer Motion
- ✅ Optimización de rendimiento con `useMemo` y `useCallback`
- ✅ Hooks personalizados para lógica reutilizable
- ✅ Estados de loading y error elegantes

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Biblioteca principal
- **TypeScript 5.8** - Tipado estático
- **Redux Toolkit** - Gestión de estado global
- **Styled Components** - Estilos CSS-in-JS
- **Framer Motion** - Animaciones
- **Yup** - Validación de datos

### Herramientas de Desarrollo
- **Vite** - Build tool y dev server
- **ESLint** - Linter de código
- **TypeScript** - Compilador de tipos

## 📁 Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ProductCard.tsx  # Tarjeta de producto individual
│   ├── ProductGrid.tsx  # Grid responsive de productos
│   └── ProductFilters.tsx # Filtros de búsqueda
├── hooks/               # Hooks personalizados
│   └── useProducts.ts   # Hook para gestión de productos
├── services/            # Servicios para API/localStorage
│   └── productService.ts # Servicio CRUD de productos
├── store/               # Configuración de Redux
│   ├── index.ts         # Store principal
│   └── slices/          # Redux slices
│       ├── productsSlice.ts  # Estado de productos
│       ├── filtersSlice.ts   # Estado de filtros
│       └── uiSlice.ts        # Estado de UI
├── styles/              # Estilos globales
│   └── GlobalStyles.ts  # Styled components y tema
├── types/               # Definiciones de tipos
│   └── index.ts         # Interfaces y tipos TypeScript
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd mini-ecommerce-panel
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Verificar código con ESLint

## 🏗️ Decisiones Técnicas

### 1. Redux Toolkit para Estado Global
**Justificación**: Redux Toolkit simplifica la configuración de Redux y proporciona herramientas modernas como createSlice y createAsyncThunk, reduciendo el boilerplate significativamente.

**Beneficios**:
- Estado predecible y centralizado
- DevTools integradas para debugging
- Manejo eficiente de acciones asíncronas
- Código más limpio y mantenible

### 2. Styled Components para Estilos
**Justificación**: Permite escribir CSS real en JavaScript con todas las ventajas de scoping automático y theming.

**Beneficios**:
- Componentes auto-contenidos
- Theming consistente
- Props dinámicos en estilos
- No hay conflictos de clases CSS

### 3. TypeScript con Interfaces Estrictas
**Justificación**: Proporciona seguridad de tipos en tiempo de compilación y mejor experiencia de desarrollo.

**Implementación**:
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4. Hooks Personalizados
**Justificación**: Encapsula lógica compleja y la hace reutilizable entre componentes.

**Ejemplo**:
```typescript
export const useProducts = () => {
  return {
    products,
    filteredProducts,
    isLoading,
    handleCreateProduct,
    // ...
  };
};
```

### 5. LocalStorage como Backend Simulado
**Justificación**: Simula un backend real con persistencia de datos y latencia artificial.

**Características**:
- Datos persistentes entre sesiones
- Simulación de latencia de red (800ms)
- Manejo de errores realista
- Datos iniciales de ejemplo

### 6. Arquitectura de Componentes Funcionales
**Justificación**: Aprovecha las ventajas de los Hooks de React para una arquitectura más moderna y funcional.

**Patrones aplicados**:
- Separación de lógica y presentación
- Componentes reutilizables y modulares
- Props tipadas con TypeScript
- Optimización con memo, useMemo y useCallback

## 📊 Gestión de Estado

### Store de Redux
El estado global está dividido en tres slices principales:

1. **Products Slice**: Gestiona productos y operaciones CRUD
2. **Filters Slice**: Maneja filtros de búsqueda
3. **UI Slice**: Controla modales y notificaciones

### Flujo de Datos
```
Componente → Action → Reducer → Store → Selector → Componente
```

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Azul (#3b82f6)
- **Grises**: Escala de grises para texto y backgrounds
- **Estados**: Verde (éxito), Rojo (error), Amarillo (warning)

### Breakpoints Responsivos
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px

### Espaciado
Sistema basado en múltiplos de 8px para consistencia visual.

## 🔧 Optimizaciones de Rendimiento

### 1. Memoización
```typescript
const filteredProducts = useMemo(() => {
}, [products, filters]);
```

### 2. Callbacks Optimizados
```typescript
const handleDelete = useCallback((id: string) => {
  // Operación de eliminación
}, [dispatch]);
```

### 3. Lazy Loading de Componentes
Los componentes se cargan de forma eficiente usando code splitting.

### 4. Animaciones Performantes
Framer Motion optimiza las animaciones usando transform y opacity.

## 📱 Responsive Design

La aplicación está optimizada para todos los dispositivos:

- **Mobile First**: Diseño que prioriza dispositivos móviles
- **Grid Adaptativo**: Se ajusta automáticamente al tamaño de pantalla
- **Touch Friendly**: Botones y áreas táctiles optimizadas
- **Navegación Intuitiva**: UX adaptada a cada dispositivo

## 🚦 Estados de Carga y Error

### Estados Implementados
- **Loading**: Spinner elegante durante operaciones asíncronas
- **Error**: Mensajes informativos con opciones de recuperación
- **Empty**: Estados vacíos con llamadas a la acción
- **Success**: Confirmaciones de operaciones exitosas

### Manejo de Errores
```typescript
try {
  await dispatch(createProduct(productData)).unwrap();
  return { success: true };
} catch (error) {
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Error desconocido' 
  };
}
```

## 🔄 Flujo de Trabajo de Desarrollo

### 1. Estructura de Commits
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `refactor:` - Refactorización de código
- `style:` - Cambios de estilo/formato
- `docs:` - Documentación

### 2. Convenciones de Código
- Componentes en PascalCase
- Hooks con prefijo `use`
- Constantes en UPPER_CASE
- Variables y funciones en camelCase

## ⏱️ Tiempo de Desarrollo

**Tiempo total dedicado**: Aproximadamente 4-5 horas

### Desglose por fases:
1. **Configuración inicial** (0.5h): Setup de proyecto, dependencias
2. **Arquitectura** (0.5h): Diseño de tipos, store, estructura
3. **Componentes base** (1h): Styled components, sistema de diseño
4. **Lógica de negocio** (1h): Redux slices, servicios, hooks
5. **Componentes UI** (1h): ProductCard, ProductGrid, Filters
6. **Integración** (1h): App principal, conectar componentes
7. **Testing y refinamiento** (0.5h): Pruebas, ajustes finales



