FROM node:18-alpine

WORKDIR /app

# Kopiuj package.json i package-lock.json
COPY package*.json ./

# Zainstaluj wszystkie zależności (w tym dev dependencies)
RUN npm ci

# Kopiuj kod aplikacji
COPY . .

# Expose port
EXPOSE 3000

# Uruchom aplikację w trybie development
CMD ["npm", "run", "dev"] 