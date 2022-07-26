FROM quay.io/centos/centos:stream8

RUN dnf -y update \
 && curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - \
 && dnf -y install \
      make \
      gcc-c++ \
      nodejs \
 && dnf clean all

RUN mkdir -p /deploy/server

COPY bin/magma_standard_linux /bin/magma

COPY bin/magma_enhanced_linux /bin/magma_enhanced

RUN chmod +x /bin/magma

RUN chmod +x /bin/magma_enhanced

WORKDIR /deploy/server

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install

# copy the rest of the application
COPY server /deploy/server

CMD npm start
