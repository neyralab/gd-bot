FROM node:16.14.2-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client

RUN npm install
RUN yarn build
RUN yarn global add serve
CMD serve -s build
