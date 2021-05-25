# studylater-app

Lleva contigo tus PDFs y estudia más tarde

## Instalación

Utilice estos comandos para clonar e instalar la aplicación:

- Clonar el repositorio: `git clone https://github.com/angelxehg/studylater-app`

- Instalar dependencias: `cd studylater-app` & `npm install`

- Iniciar servidor de desarrollo: `npm run start`

- Crear nuevo proyecto de [Firebase](https://console.firebase.google.com/). Se requiere habilitar como minimo:

  - Crear una [Aplicación Web](https://firebase.google.com/docs/web/setup#register-app)
  - Configurar Google como [método de acceso](https://firebase.google.com/docs/auth/web/google-signin#before_you_begin)
  - Configurar [dominios autorizados](https://support.google.com/firebase/answer/6400741)

- Configurar variables en un nuevo archivo `.env.local`

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGE_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

## Instalación en Dispositivos

Compilar y probar aplicación en dispositivos:

- Compilar assets: `npm run build`

- Copiar assets y actualizar plugins:

  - Android: `npx cap sync android`

  - iOS: `npx cap sync ios`

- Abrir IDE y compilar:

  - Android: `npx cap open android` (Requiere Android Studio)

  - iOS: `npx cap open ios` (Requiere XCode)
