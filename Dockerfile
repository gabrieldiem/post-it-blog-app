# Use an official Node.js runtime as a parent image
FROM node:22-alpine
RUN apk update && apk add bash && apk add sed

# Set the working directory inside the container
WORKDIR /

# Copy the rest of the application files
COPY . .

RUN chmod +x scripts/setup_docker.sh

RUN scripts/setup_docker.sh

# Expose the port the app runs on
EXPOSE 3000 3001

# Define the command to run the application
ENTRYPOINT [ "/scripts/run.sh" ] 
