FROM node:20.15.1

WORKDIR /app

COPY package*.json /app

RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 5173


CMD ["npm","run","dev"]