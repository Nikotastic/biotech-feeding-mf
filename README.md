# 🌾 BioTech Feeding - Gestión de Alimentación

Módulo de planificación y control de alimentación animal.

## 🚀 Características

- **Horarios de alimentación**: Programación por tiempos
- **Planes nutricionales**: Por tipo de animal
- **Control de raciones**: Cantidades y tipos de alimento
- **Registro de consumo**: Tracking diario
- **Alertas**: Notificaciones de horarios
- **Reportes**: Consumo por animal/grupo
- **Gestión de inventario**: Stock de alimentos

## 🛠️ Tecnologías

- React 18
- Vite + Module Federation
- React Hook Form + Yup
- Axios
- Zustand
- Tailwind CSS

## 📦 Instalación

```bash
npm install
npm run dev  # Puerto 5003
```

## 🔌 Componentes Expuestos

```javascript
// Horario de alimentación
import('feedingMF/FeedingSchedule')

// Plan de alimentación
import('feedingMF/FeedingPlan')

// Store
import('feedingMF/FeedingStore')
```

## 📁 Estructura

```
src/
├── features/
│   ├── feeding-schedule/
│   │   ├── components/
│   │   │   └── FeedingSchedule.jsx
│   │   ├── hooks/
│   │   └── services/
│   └── feeding-plan/
│       ├── components/
│       │   └── FeedingPlan.jsx
│       ├── validations/
│       └── services/
├── shared/
│   ├── store/
│   │   └── feedingStore.js
│   ├── constants/
│   │   └── feedTypes.js
│   └── utils/
└── App.jsx
```

## 🥗 Tipos de Alimento

```javascript
export const FEED_TYPES = {
  CONCENTRATE: 'Concentrado',
  FORAGE: 'Forraje',
  SILAGE: 'Ensilaje',
  SUPPLEMENT: 'Suplemento',
  MINERAL: 'Mineral'
}

export const MEAL_TIMES = {
  MORNING: 'Mañana',
  NOON: 'Mediodía',
  AFTERNOON: 'Tarde',
  NIGHT: 'Noche'
}
```

## 🌍 API Endpoints

```javascript
GET    /api/feeding/schedule       // Horarios
POST   /api/feeding/schedule       // Crear horario
GET    /api/feeding/plans          // Planes
POST   /api/feeding/plans          // Crear plan
GET    /api/feeding/consumption    // Consumo
POST   /api/feeding/record         // Registrar comida
```

## 📝 Plan de Alimentación

```typescript
interface FeedingPlan {
  id: number
  name: string
  animalType: string
  description: string
  meals: [
    {
      time: string
      feedType: string
      quantity: number
      unit: string
    }
  ]
  nutritionalInfo: {
    protein: number
    energy: number
    fiber: number
  }
}
```

## ⏰ Horarios

- **Mañana**: 06:00 AM
- **Mediodía**: 12:00 PM
- **Tarde**: 06:00 PM
- **Noche**: 10:00 PM

## 📊 Reportes

- Consumo diario por animal
- Consumo mensual por tipo
- Costos de alimentación
- Eficiencia alimenticia
- Stock de alimentos

## 🔔 Notificaciones

```javascript
// Alertas programadas
- 30 min antes del horario
- Stock bajo de alimento
- Cambio de plan nutricional
```

## 🚀 Deploy

```bash
npm run build
vercel --prod
```

## 📞 Contacto

- Email: feeding@biotech.com
- Docs: https://docs.biotech.com/feeding
```