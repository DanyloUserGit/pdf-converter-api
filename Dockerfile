FROM node:20-bookworm-slim

# Оновлюємо систему та встановлюємо LibreOffice
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    libreoffice \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Встановлюємо робочу директорію
WORKDIR /src

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо npm залежності
RUN npm install

# Копіюємо вихідний код
COPY . .

# Компілюємо TypeScript
RUN npm run build

# Відкриваємо порт
EXPOSE 8000

# Запускаємо додаток
CMD ["npm", "run", "start"]
