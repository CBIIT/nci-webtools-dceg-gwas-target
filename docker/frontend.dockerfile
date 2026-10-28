# ---- Builder: compile the React app ----
FROM public.ecr.aws/amazonlinux/amazonlinux:2023 AS builder

# AL2023 ships versioned Node packages; the unversioned 'nodejs' package is Node 18 (EOL and
# unpatched for the Brotli RCE CVE-2026-111497). nodejs24 resolves to Node 24.x.
RUN dnf -y install \
    make \
    nodejs24 \
    nodejs24-npm \
 && dnf clean all

WORKDIR /deploy/client

# `npm ci` installs exactly what package-lock.json records, so the build matches the
# scanned lockfile instead of re-resolving semver ranges on every build.
COPY client/package.json client/package-lock.json /deploy/client/
RUN npm ci

COPY client /deploy/client/

ARG REACT_APP_GTAG
ENV REACT_APP_GTAG ${REACT_APP_GTAG}

ARG REACT_APP_VERSION=local
ENV REACT_APP_VERSION=${REACT_APP_VERSION}

RUN npm run build

# ---- Runtime: httpd serving only the static build ----
# The runtime image carries no Node, npm, node_modules or build toolchain, only httpd and the
# compiled static output, which removes the whole class of nodejs/npm-bundle findings that
# scanners flag inside the toolchain but that never run in production.
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
 && dnf -y install httpd \
 && dnf clean all

# python3 (3.9) cannot be removed from the base image (dnf depends on it) and AL2023 ships no
# build that clears the application-level CVE-2025-12781 finding ("No Fix Planned"). Agreed
# mitigation: make the interpreter executable by root only so the httpd worker processes
# (user apache) cannot invoke it. Nothing at runtime uses python.
RUN chmod 700 /usr/bin/python3.9

COPY --from=builder /deploy/client/build /var/www/html/gwas-target

WORKDIR /var/www/html

RUN touch index.html

# Add custom httpd configuration
COPY docker/httpd-gwastarget.conf /etc/httpd/conf.d/httpd-gwastarget.conf

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
   && exec /usr/sbin/httpd -DFOREGROUND
