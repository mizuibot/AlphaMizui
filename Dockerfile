FROM node:20

RUN apt-get update && apt-get install -y \
  fonts-dejavu-core \
  fonts-noto \
  fonts-liberation

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
