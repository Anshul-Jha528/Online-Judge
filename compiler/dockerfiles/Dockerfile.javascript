FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

# Install interpreter shell utilities
RUN apk update && apk add --no-cache \
    bash

# Create directories if they don't exist
RUN mkdir -p codes inputs outputs

# Node images already come with a built-in non-root user named 'node'
USER node