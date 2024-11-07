FROM node:18

WORKDIR /app

COPY ../../../../package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 100

CMD ["npm", "start"]
