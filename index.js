// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// Requerir las librerías necesarias
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Leer el token de GitHub desde las variables de entorno
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Configuración del repositorio y ramas
const REPO_OWNER = 'Jonixmax'; // Nombre de usuario del repositorio (fork)
const REPO_NAME = 'bitcoin-educational-content'; // Nombre del repositorio
const BASE_BRANCH = 'dev'; // Rama base para crear el Pull Request
const NEW_BRANCH = `feature/add-content-jonathan`; // Nueva rama que se creará
const FILE_PATH = 'resources/nuevo-recurso.md'; // Ruta del archivo a crear o editar
const COMMIT_MESSAGE = 'Agregando nuevo recurso de prueba'; // Mensaje de commit
const PR_TITLE = 'Agregando un recurso de prueba'; // Título del Pull Request
const PR_BODY = 'Este PR agrega un nuevo recurso de prueba en la carpeta resources.'; // Cuerpo del Pull Request

// Función para realizar peticiones a la API de GitHub
async function githubRequest(endpoint, method = 'GET', data = null) {
    try {
        // Realizar la petición HTTP a la API de GitHub
        const response = await axios({
            url: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${endpoint}`,
            method,
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
            data,
        });
        return response.data;
    } catch (error) {
        // Si hay un error en la API, se muestra el mensaje y se termina el proceso
        console.error('Error en la API de GitHub:', error.response ? error.response.data : error.message);
        process.exit(1); // Terminar el proceso en caso de error
    }
}

// Función para crear una nueva rama en el repositorio de GitHub
async function createBranch() {
    console.log(`Creando nueva rama en GitHub: ${NEW_BRANCH}`);
    
    // Obtener el último commit de la rama base
    const baseBranchData = await githubRequest(`git/refs/heads/${BASE_BRANCH}`);
    const baseSha = baseBranchData.object.sha; // SHA del último commit de la rama base

    try {
        // Crear la nueva rama a partir de la rama base
        await githubRequest(`git/refs`, 'POST', {
            ref: `refs/heads/${NEW_BRANCH}`,
            sha: baseSha, // Se usa el commit base para crear la nueva rama
        });
        console.log(`Rama ${NEW_BRANCH} creada con éxito.`);
    } catch (error) {
        // Si la rama ya existe, no se detiene el proceso
        if (error.response?.status === 422) {
            console.log(`La rama ${NEW_BRANCH} ya existe. Continuando...`);
        } else {
            throw error; // Si ocurre otro error, se lanza
        }
    }
}

// Función para subir el archivo al repositorio
async function uploadFile() {
    console.log(`Creando archivo en ${FILE_PATH}`);

    // Verificar si la carpeta donde se almacenará el archivo existe
    const dirPath = path.dirname(FILE_PATH);
    if (!fs.existsSync(dirPath)) {
        console.log(`La carpeta '${dirPath}' no existe. Creándola...`);
        fs.mkdirSync(dirPath, { recursive: true }); // Crear la carpeta si no existe
    }

    // Contenido del archivo Markdown a agregar
    const fileContent = `# Recurso de prueba\n\n- **Título:** Prueba con la api \n- **URL:** [https://planb.network/en/events](https://planb.network/en/events)\n- **Descripción:** Una prueba .`;

    // Escribir el contenido en el archivo
    fs.writeFileSync(FILE_PATH, fileContent);
    console.log(`Archivo creado: ${FILE_PATH}`);

    console.log(`Subiendo archivo a GitHub...`);

    // Codificar el contenido en base64 para la API de GitHub
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // Subir el archivo codificado a GitHub
    await githubRequest(`contents/${FILE_PATH}`, 'PUT', {
        message: COMMIT_MESSAGE, // Mensaje de commit
        content: encodedContent, // Contenido codificado
        branch: NEW_BRANCH, // Rama donde se subirá el archivo
    });

    console.log(`Archivo ${FILE_PATH} subido correctamente.`);
}

// Función para crear el Pull Request
async function createPullRequest() {
    console.log('Creando Pull Request...');
    
    // Crear el Pull Request hacia la rama base desde la nueva rama
    const prData = await githubRequest('pulls', 'POST', {
        title: PR_TITLE, // Título del PR
        body: PR_BODY, // Descripción del PR
        head: `${REPO_OWNER}:${NEW_BRANCH}`, // Rama de origen del PR
        base: BASE_BRANCH, // Rama de destino del PR
    });
    
    // Mostrar la URL del PR creado
    console.log(`Pull Request creado: ${prData.html_url}`);
}

// Función principal que ejecuta todas las acciones
async function main() {
    console.log('Conectando con GitHub...');
    await createBranch(); // Crear una nueva rama
    await uploadFile(); // Subir el archivo al repositorio
    await createPullRequest(); // Crear el Pull Request
}

// Ejecutar la función principal
main();
