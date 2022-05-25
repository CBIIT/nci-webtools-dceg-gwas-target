FROM quay.io/centos/centos:stream9

RUN dnf -y update \
 && dnf -y install \
    httpd \
    make \
    nodejs \
 && dnf clean all

RUN mkdir /client

WORKDIR /client

COPY client/package*.json /client/

RUN npm install

COPY client /client/

RUN npm run build \
 && cp -r /client/build /var/www/html/gwas-target

WORKDIR /var/www/html

# Add custom httpd configuration
COPY docker/httpd-gwastarget.conf /etc/httpd/conf.d/httpd-gwastarget.conf

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
 && exec /usr/sbin/httpd -DFOREGROUND