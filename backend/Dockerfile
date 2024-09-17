FROM node:18.20-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client supervisor bash nano

RUN yarn install

RUN mkdir -p /etc/supervisor/conf.d
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY app.conf /etc/supervisor/conf.d/

# Use supervisor as the entrypoint
ENTRYPOINT ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
