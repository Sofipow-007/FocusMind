# FocusMind — Frontend

Frontend SPA de FocusMind desarrollada con React y Vite.

## Instalación

```bash
npm install
```

Configurá `VITE_API_URL` en `.env` usando `.env.example` como referencia.

## Desarrollo

```bash
npm run dev
```

## Validaciones

```bash
npm run build
npm run lint
npm run test:storage
```

`src/services/storage.js` es una capa temporal para persistencia de prototipo. No debe utilizarse para contraseñas, hashes, tokens JWT ni otros secretos.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Configuración del proyecto

El React Compiler no forma parte de la configuración actual del proyecto.

## Expanding the Oxlint configuration

La configuración de Oxlint se encuentra en `.oxlintrc.json`.
