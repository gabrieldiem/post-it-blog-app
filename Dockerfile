# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

RUN apk add --no-cache bash sed

# Set the working directory inside the container
WORKDIR /

# Copy the rest of the application files
COPY . .

RUN chmod +x scripts/setup_docker.sh && scripts/setup_docker.sh

# Expose the port the app runs on
EXPOSE 3000 3001

# Define the command to run the application
ENTRYPOINT [ "/scripts/run.sh" ] 
