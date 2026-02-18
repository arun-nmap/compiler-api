FROM ubuntu:22.04

RUN apt update && \
    apt install -y gcc nodejs npm && \
    mkdir /app

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
