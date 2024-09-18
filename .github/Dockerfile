FROM node:18.20-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client supervisor 

RUN yarn install

COPY .github/supervisord-front.conf /etc/supervisor/supervisord-front.conf
COPY .github/supervisord-back.conf /etc/supervisor/supervisord-back.conf
