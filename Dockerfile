FROM node:18-alpine

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "start"]
