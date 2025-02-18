# CineXpress - Sistema de Recomendación de Películas

## 🎬 Descripción
CineXpress es una plataforma moderna de recomendación de películas que utiliza inteligencia artificial para proporcionar sugerencias personalizadas basadas en los gustos del usuario.

## ✨ Características
- 🤖 Sistema de recomendación basado en IA
- 🎯 Recomendaciones personalizadas
- 🔍 Búsqueda por películas y géneros
- 👤 Perfiles de usuario personalizables
- 🌙 Modo oscuro/claro
- 📱 Diseño responsive

## 🛠️ Tecnologías
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Framer Motion
- Lucide Icons

## 📋 Requisitos Previos
- Node.js 16.8 o superior
- npm o yarn
- Git

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` con las siguientes variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_de_tmdb
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📁 Estructura del Proyecto
```
frontend/
├── app/               # Rutas y páginas de la aplicación
├── components/        # Componentes reutilizables
├── hooks/            # Custom hooks
├── lib/              # Utilidades y configuraciones
├── services/         # Servicios de API
├── styles/           # Estilos globales
└── types/            # Definiciones de tipos
```

## 🔍 Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta las pruebas

## 🤝 Contribuir
1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✍️ Autor
- Nombre del Autor
- Email de contacto
- LinkedIn/GitHub

## 🙏 Agradecimientos
- Shadcn/UI por los componentes
- Vercel por el hosting
- TMDB por la API de películas
