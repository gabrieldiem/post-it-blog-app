# Blog App con DB

Blog webapp con uso de base de datos SQL y NoSQL para la materia Base de Datos TA044

## Cómo correrlo

El frontend será accesible mediante el puerto 3000 vía: <a href="localhost:3000" target="_blank">localhost:3000</a>, mientras que el backend será accesible mediante el puerto 3001 vía: <a href="localhost:3001" target="_blank">localhost:3001</a>.

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

### Con Docker

El modo con Docker usa una base de Linux Alpine con NodeJS 22.

1. Para crear la imagen de Docker:

```shell
docker build -t blog-app .
```

2. Para correr el container:

```shell
docker run -p 3000:3000 -p 3001:3001 blog-app
```