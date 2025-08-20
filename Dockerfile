# Stable Node image
FROM node:20-alpine AS deps

# Working directory inside the container
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
# Copy the entire backend project into the container
COPY . .
ENV PORT=8080
# Expose the backend port
EXPOSE 8080
# Start the app
CMD ["npm","start"]


