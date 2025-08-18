# Stable Node image
FROM node:20

# Working directory inside the container
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend project into the container
COPY . .

# Expose the backend port (adjust if you use a different port)
EXPOSE 3000

# Start the app (adjust if the start script is different)
CMD ["npm", "run", "dev"]
