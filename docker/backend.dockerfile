FROM quay.io/centos/centos:stream9

RUN dnf -y update \
 && dnf -y install \
    nodejs \
 && dnf clean all

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install

# copy the rest of the application
COPY server /deploy/server

CMD npm start
