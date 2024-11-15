# Usa una imagen de Node para construir el proyecto
FROM node:20.15.1 AS build

# Instalar cross-env
RUN npm install -g cross-env

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto a Docker
COPY . .

# Instala las dependencias y genera el build
RUN npm install --force
RUN npm run build

# Usa una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos de build al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto en el que Nginx sirve la aplicación
EXPOSE 8080

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]