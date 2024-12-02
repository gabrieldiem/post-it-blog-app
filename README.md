# PostIt

Una webapp para hacer blogs, con uso de base de datos SQL para almacenar los posts, comentarios y usarios, y una base NoSQL para manejar los attachments, para la materia Base de Datos TA044.

#### Tabla de contenidos:

1. [Integrantes](#Integrantes)
2. [Cómo ejecutarlo](#Cómo-ejecutarlo)
   1. [Completado de credenciales en `.env`](#Completadode-credenciales-en-.env)
   2. [Nativamente local](#Nativamente-local)
   3. [Con Docker en un sólo container](#Con-Docker-en-un-sólo-container)
   4. [Con Docker en dos containers](#Con-Docker-en-dos-containers)
3. [Cómo hacer setup del repo](#Cómo-hacer-setup-del-repo)
4. [Deployment a la nube](#Deployment-a-la-nube)

#### Integrantes

| Alumno               | Padrón | Email                 |
| -------------------- | ------ | --------------------- |
| Diem, Walter Gabriel | 105618 | wdiem@fi.uba.ar       |
| Etchegoyen, Pedro    | 107241 | petchegoyen@fi.uba.ar |
| Maiolo, Alejandro    | 88461  | amaiolo@fi.uba.ar     |
| Zitelli, Gabriel     | 105671 | gitelli@fi.uba.ar     |

## Cómo ejecutarlo

El frontend será accesible mediante el puerto 8080 vía: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a>, mientras que el backend será accesible mediante el puerto 8081 vía: <a href="http://localhost:8081" target="_blank">http://localhost:8081</a>.

### Completado de credenciales en `.env`

Se deben crear archivos `.env` basados en los `.env.example` presentes en el repositorio:

Para `/frontend/ui`:

1. Crear una copia del archivo `.env.local.example` con el nombre `.env.local`. No hace falta completar nada dentro del archivo.

Para `/frontend/server`:

1. Crear una copia del archivo `.env.example` con el nombre `.env`. No hace falta completar nada dentro del archivo.

Para `/backend`:

1. Crear una copia del archivo `.env.example` con el nombre `.env`.

2. Completar la variable `MONGO_DB_URI` con el valor correspondiente a la URI de la base de datos MongoDB para realizar la conexión con mongoose.

### Nativamente local

El modo local instala NodeJS v22 con NVM (Node Version Management).

1. Para hacer el setup en modo `development` correr:

```shell
./scripts/setup_local.sh
```

2. Para iniciar el proyecto correr:

```shell
./scripts/run.sh
```

### Con Docker en un sólo container

El modo con Docker en un sólo container, es decir, tanto el backend como el frontend están en el mismo container y se exponen ambos puertos, usa una base de Linux Alpine con NodeJS 22.

1. Para crear la imagen de Docker:

```shell
docker build -t blog-app .
```

2. Para correr el container:

```shell
docker run -p 8080:8080 -p 8081:8081 blog-app
```

### Con Docker en dos containers

El modo con Docker en dos containers, es decir, tanto el backend como el frontend están en su propio container y cada uno expone su puerto, usa una base de Linux Alpine con NodeJS 22.

1. Para crear la imagen de Docker del backend:

```shell
docker build -t blog-app-backend ./backend
```

2. Para crear la imagen de Docker del frontend:

```shell
docker build -t blog-app-frontend ./frontend
```

3. Para correr los containers:

```shell
docker run -p 8081:8081 blog-app-backend
```

```shell
docker run -p 8080:8080 blog-app-frontend
```

## Cómo hacer setup del repo

Una vez clonado el repo se deben instalar los pre-commit hooks establecidos con el siguiente comando:

```shell
pre-commit install
```

Si no se tiene la utilidad `pre-commit` instalada correr el siguiente comando:

```shell
pip install pre-commit
```

## Deployment a la nube

Se trabaja con un repositorio privado de Docker Hub.

1. Build images:

```shell
docker build -t blog-app-backend ./backend
```

```shell
docker build -t blog-app-frontend ./frontend
```

2. Tag images:

```shell
docker image tag blog-app-backend gabrieldiem/gprivate:blog-app-backend
```

```shell
docker image tag blog-app-frontend gabrieldiem/gprivate:blog-app-frontend
```

3. Push image:

```shell
docker image push gabrieldiem/gprivate:blog-app-backend
```

```shell
docker image push gabrieldiem/gprivate:blog-app-frontend
```
