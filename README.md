
# Práctica de GitHub API - Agregar Recurso y Pull Request

Este proyecto interactúa con la API de GitHub para crear una nueva rama, subir un archivo a un repositorio, y crear un Pull Request (PR). Está diseñado para ser un ejemplo práctico de cómo automatizar tareas comunes en GitHub utilizando Node.js y su API.

## Requisitos

Antes de ejecutar este script, asegúrate de tener:

- **Node.js** instalado en tu máquina (versión 14.x o superior).
- Un **token de GitHub** con permisos adecuados para acceder y modificar el repositorio (puedes generar un token en [GitHub Settings](https://github.com/settings/tokens)).
- El repositorio de GitHub al que deseas hacer cambios (el repositorio debe estar en tu cuenta de GitHub, o ser un repositorio al que tengas permisos).

## Instalación

1. **Clona o descarga el repositorio**:
   Si aún no lo has hecho, clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/Jonixmax/practica.git
   ```

2. **Instala las dependencias**:
   Una vez que hayas clonado el repositorio, navega a la carpeta del proyecto e instala las dependencias:
   ```bash
   cd practica
   npm install
   ```

   Esto instalará las siguientes dependencias:
   - `axios`: Para hacer peticiones HTTP a la API de GitHub.
   - `dotenv`: Para cargar las variables de entorno desde un archivo `.env`.
   - `simple-git`: Para trabajar con Git directamente desde Node.js (si decides usarlo más adelante).

## Configuración

1. **Crea un archivo `.env`** en la raíz del proyecto con el siguiente contenido:

   ```bash
   GITHUB_TOKEN=tu_token_de_github
   ```

   Asegúrate de reemplazar `tu_token_de_github` con el token de GitHub que creaste.

2. **Configuración del repositorio**:
   Modifica los parámetros de configuración en el archivo `index.js`:
   - `REPO_OWNER`: Nombre de usuario del propietario del repositorio.
   - `REPO_NAME`: Nombre del repositorio.
   - `BASE_BRANCH`: Rama base desde donde se creará el PR.
   - `NEW_BRANCH`: Nombre de la nueva rama a crear.
   - `FILE_PATH`: Ruta donde se creará o editará el archivo en el repositorio.
   - `COMMIT_MESSAGE`: Mensaje que se usará para el commit.
   - `PR_TITLE` y `PR_BODY`: Título y cuerpo del Pull Request.

## Uso

1. **Ejecuta el script** para crear la nueva rama, subir el archivo y crear el Pull Request:
   ```bash
   node index.js
   ```

   Esto realizará los siguientes pasos:
   - Crea una nueva rama en el repositorio a partir de la rama base.
   - Sube el archivo especificado a la nueva rama.
   - Crea un Pull Request hacia la rama base desde la nueva rama.

2. **Verifica el Pull Request**:
   Para asegurarte de que el Pull Request se haya creado correctamente, puedes usar la CLI de GitHub o `curl` para listar los PRs abiertos:

   ```bash
   curl -H "Authorization: token tu_token_de_github" https://api.github.com/repos/Jonixmax/bitcoin-educational-content/pulls
   ```

   O usando la CLI de GitHub:
   ```bash
   gh pr list --repo Jonixmax/bitcoin-educational-content
   ```




