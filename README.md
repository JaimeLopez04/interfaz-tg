
# FRONTEND, Prototipo de análisis de sentimientos en visión por computadora en las aulas de clase de la Universidad del Valle sede Tuluá en FAST API

## Descripción

Este repositorio contiene el Código fuente del **FRONTEND** para el proyecto análisis de sentimientos por visión de computadora en las aulas de clase de la universidad del valle sede Tuluá, este proyecto pretender ser un apoyo para que los docentes puedan tener una mejor metodología de enseñanza mejorando así significativamente la calidad de la enseñanza y el nivel actual de la educación pues mediante esta app logramos ver en qué momentos las clases pasan de ser entretenidas a algo totalmente diferente brindando un punto de inflexión para que el docente pueda cambiar su metodología.

### Características claves del **FRONTEND**

- **Autenticación de usuarios**: Esta aplicación permite fácilmente la autenticación de usuarios mediante un correo y una contraseña.
- **Registro de usuarios**: Para el registro de usuarios se recogen datos básicos como los nombres, los apellidos, el correo y la contraseña.
- **Análisis de sentimientos**: Realizando el envío de videos de manera periódica, mientras se tiene una sesión de clases para ser analizada por el algoritmo de análisis de sentimientos con el que cuenta el *API*.
- **Resumen semanal**: La aplicación brinda un resumen semanal de las emociones que se han registrado durante todas las clases.
- **Resumen de emociones**: La aplicación facilita al usuario poder ver los videos de las emociones negativas en tiempo real, así como poder verlos después de las clases para saber en qué momentos las emociones cambiaron.

Esta **FRONTEND** fue desarrollada en *JavaScript* y el framework *ReactJS* y sigue las mejores prácticas de la industria para garantizar la escalabilidad, el rendimiento y la seguridad. Permitiendo un funcionamiento fluido para evitar retrasos en la aplicación.

***Nota***: Esta aplicación se encuentra en fase de prototipo, por lo que puede contar con demoras de ejecución o pequeños errores que serán solucionados en trabajos posteriores.

## Primeros pasos

Para instalar el **FRONTEND** de la aplicación, siga estos pasos:

1. Requisitos para poder ejecutar el proyecto:

    - Contar con una versión de *NodeJS* 18.18.0LTS o superior.
    - Tener instalado *npm* para instalar las dependencias del proyecto.
    - Tener iniciado el servidor de *FAST API*.
    - *Opcional*, también puedes usar *pnpm* para instalar las dependencias del proyecto.

2. Clonar el repositorio [interfaz-tg](https://github.com/JaimeLopez04/interfaz-tg)

    ```shell
    git clone https://github.com/JaimeLopez04/FastAPI-TG.git
    ```

3. Navegar al directorio del proyecto

    ```shell
    cd interfaz-tg
    ```

4. Instalar las dependencias del proyecto

    ```shell
    npm install
    ```

    ó también puedes usar

    ```shell
    pnpm install
    ```

5. Iniciar el proyecto

    ```shell
    npm run dev
    ```

    ó también puedes usar

    ```shell
    pnpm run dev
    ```

***Nota***
Si no tienes instalado *NodeJS* puedes descargarlo desde [NodeJS](https://nodejs.org/es/)
También puede que tengas que instalar de forma manual la librería *isomorphic-fetch* lo cual puedes realizar usando el siguiente comando:

```shell
npm install isomorphic-fetch
```

ó con pnpm usando

```shell
pnpm install isomorphic-fetch
```
