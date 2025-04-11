# Registro de Cargas de Combustible

Aplicación web para registrar y gestionar las cargas de combustible de tu vehículo.

## Características

- Registro de precio por litro
- Registro de cantidad de litros
- Selección de ubicación usando Google Maps
- Historial de cargas
- Cálculo automático del costo total
- Interfaz moderna y responsiva

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Una cuenta de Google Cloud Platform con Maps JavaScript API habilitada
- Backend con MongoDB Atlas configurado

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd rendimiento-auto
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Actualiza las variables con tus valores:
     - `REACT_APP_API_URL`: URL de tu backend
     - `REACT_APP_GOOGLE_MAPS_API_KEY`: Tu API key de Google Maps

4. Inicia la aplicación:
```bash
npm start
```

## Uso

1. Para registrar una nueva carga:
   - Ingresa el precio por litro
   - Ingresa la cantidad de litros
   - Ingresa el nombre de la estación
   - Selecciona la ubicación en el mapa
   - Haz clic en "Guardar Registro"

2. Para ver el historial:
   - Los registros se muestran en la tabla inferior
   - Puedes eliminar registros usando el botón de eliminar

## Tecnologías Utilizadas

- React
- TypeScript
- Material-UI
- Google Maps API
- Axios
- MongoDB Atlas

## Estructura del Proyecto

```
src/
  ├── components/         # Componentes de React
  ├── services/          # Servicios de API
  ├── types/             # Definiciones de tipos TypeScript
  ├── App.tsx            # Componente principal
  └── index.tsx          # Punto de entrada
```

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
