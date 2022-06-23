FROM quay.io/centos/centos:stream9

RUN dnf -y update \
 && curl -fsSL https://rpm.nodesource.com/setup_16.x | bash - \
 && dnf -y install \
    httpd \
    make \
    nodejs \
 && dnf clean all

RUN mkdir -p /deploy/client

WORKDIR /deploy/client

COPY client/package*.json /deploy/client/

RUN npm install

COPY client /deploy/client/

RUN npm run build \
 && cp -r /client/build /var/www/html/gwas-target

WORKDIR /var/www/html

RUN touch index.html

# Add custom httpd configuration
COPY docker/httpd-gwastarget.conf /etc/httpd/conf.d/httpd-gwastarget.conf

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
 && exec /usr/sbin/httpd -DFOREGROUND