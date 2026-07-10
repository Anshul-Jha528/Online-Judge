FROM --platform=linux/amd64 alpine:3.19

WORKDIR /app

# Install compiler/interpreter
RUN apk update && apk add --no-cache \
    g++ \
    bash

# Create directories if they don't exist
RUN mkdir -p codes inputs outputs

# Run as a non-root user for security sandbox execution
RUN adduser -D -u 1001 judgeuser
USER judgeuser