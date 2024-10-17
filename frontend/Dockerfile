FROM node:20-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client

RUN yarn install \
 && yarn build
CMD yarn prod
