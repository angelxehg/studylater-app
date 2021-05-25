# studylater-app

Lleva contigo tus PDFs y estudia más tarde

## Instalación

Utilice estos comandos para clonar e instalar la aplicación:

- Hacer Fork al repositorio de [studylater-app](https://github.com/angelxehg/studylater-app)

- Instalar dependencias: `npm install`

- Iniciar servidor de desarrollo: `npm run start`

- Cambiar el AppId de `com.angelxehg.studylater` a **otro** [AppId válido](https://developer.android.com/studio/build/application-id), en los siguientes archivos:

  - [capacitor.config.ts](./capacitor.config.ts)
  - [android/app/build.gradle](./android/app/build.gradle)
  - [android/app/release/output-metadata.json](./android/app/release/output-metadata.json)
  - [android/app/src/main/AndroidManifest.xml](./android/app/src/main/AndroidManifest.xml)
  - [android/app/src/main/assets/capacitor.config.json](./android/app/src/main/assets/capacitor.config.json)
  - [android/app/src/main/res/values/strings.xml](./capacitor.config.ts)
  - [android/app/src/main/java/com/angelxehg/studylater/MainActivity.java](./android/app/src/main/java/com/angelxehg/studylater/MainActivity.java). NOTA: tambien cambiar su ubicación de `com/angelxehg/studylater` a una que coincida con el [AppId]

- Crear nuevo proyecto de [Firebase](https://console.firebase.google.com/). Se requiere habilitar como minimo:

  - Crear una [Aplicación Web](https://firebase.google.com/docs/web/setup#register-app)
  - Configurar Google como [método de acceso](https://firebase.google.com/docs/auth/web/google-signin#before_you_begin)
  - Crear una [Aplicación Android](https://developers.google.com/mobile/add?platform=android&cntapi=signin). Asegurate de completar la opción [Certificado de firma SHA-1 de depuración](https://developers.google.com/drive/android/auth) tanto para la clave `debug` como para `release` (si es que tienes una).
  - No es necesario copiar el archivo `google-services.json`, pero es necesario obtener de este archivo el valor `REACT_APP_FIREBASE_WEB_CLIENT_TYPE3`, ubicado en `"client_id"` en la versión `"client_type": 3`, que se encuentra en `"oauth_client"`:

```json
{
  "oauth_client": [
    {
      "client_id": "xxxxxx.apps.googleusercontent.com",
      "client_type": 3
    }
  ],
}
```
  
NOTA: Para más información consulta la documentación del [plugin Google Plus](https://github.com/EddyVerbruggen/cordova-plugin-googleplus#android)

- Configurar variables en un nuevo archivo `.env.local`

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGE_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_WEB_CLIENT_TYPE3=
```

## Probar en Dispositivos

Compilar y probar aplicación en dispositivos:

- Compilar assets: `npm run build`

- Ejecutar Jetifier: `npx jetify`. Sin este paso, la compilación en android [fallará](https://github.com/pwlin/cordova-plugin-file-opener2/issues/256#issuecomment-657574795)

- Copiar assets y actualizar plugins:

  - Android: `npx cap sync android`

  - iOS: `npx cap sync ios`

Ejecutar `npm run start`, e incluir la url pública en el archivo `capacitor.config.ts`:

```ts
const config: CapacitorConfig = {
  server: {
    url: "http://192.168.0.63:3000",
    cleartext: true
  },
};
```

NOTA: Deberas revertir este cambio cuando dejes de usar LiveReload, o quieras generar una versión para producción

- Ver dispositivos disponibles:

  - Android: `npx cap run android --list`

  - iOS: `npx cap run ios --list`

- Ejecutar en dispositivo:

  - Android: `npx cap run android --target [ID de Target]`

  - iOS: `npx cap run ios --target [ID de Target]`

Consulta más sobre [LiveReload](https://capacitorjs.com/docs/guides/live-reload)

## Generar versión de Producción

Compilar y probar aplicación en dispositivos:

- Compilar assets: `npm run build`

- Ejecutar Jetifier: `npx jetify`. Sin este paso, la compilación en android [fallará](https://github.com/pwlin/cordova-plugin-file-opener2/issues/256#issuecomment-657574795)

- Copiar assets y actualizar plugins:

  - Android: `npx cap sync android`

  - iOS: `npx cap sync ios`

- Abrir IDE y compilar:

  - Android: `npx cap open android` (Requiere Android Studio)

  - iOS: `npx cap open ios` (Requiere XCode)
