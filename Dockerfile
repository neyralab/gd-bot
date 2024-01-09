FROM node:16.14.2-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client

RUN npm install

CMD ["npm", "start"]
