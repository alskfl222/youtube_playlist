FROM node:16.14.2-alpine

WORKDIR /server

RUN apk add --update npm
RUN npm install -g yarn
RUN yarn install

CMD yarn start