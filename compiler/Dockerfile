FROM node:22-bookworm

# Install compilers/interpreters
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create directories if they don't exist
RUN mkdir -p temp

EXPOSE 3000

CMD ["npm", "start"]