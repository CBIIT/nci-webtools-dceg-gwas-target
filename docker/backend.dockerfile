FROM public.ecr.aws/amazonlinux/amazonlinux:2022

RUN dnf -y update \
 && dnf -y install \
    make \
    gcc-c++ \
    nodejs \
    npm \
 && dnf clean all

RUN mkdir -p /server

WORKDIR /server

# use build cache for npm packages
COPY server/package.json server/package-lock.json /server/

RUN npm install

# copy the rest of the application
COPY server /server

RUN chmod -R +x /server/bin

CMD npm start
