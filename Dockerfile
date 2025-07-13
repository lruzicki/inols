FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3001

# Run application in development mode
CMD ["npm", "run", "dev"] 