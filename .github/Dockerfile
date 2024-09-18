FROM node:18.20-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client supervisor 

RUN yarn install

COPY supervisord.conf /etc/supervisor/supervisord.conf
