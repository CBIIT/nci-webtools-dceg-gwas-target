FROM quay.io/centos/centos:stream8

RUN dnf -y update \
 && curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - \
 && dnf -y install \
      make \
      gcc-c++ \
      nodejs \
 && dnf clean all

COPY bin/magma_standard_linux /bin/magma

RUN chmod +x /bin/magma

COPY bin/magma_enhanced_linux /bin/magma_enhanced

RUN chmod +x /bin/magma_enhanced

ARG UID=1000

ARG GID=1000

ARG USER=user

RUN groupadd --gid ${GID} ${USER}

RUN useradd --uid ${UID} --gid ${GID} -s /bin/bash ${USER}

RUN mkdir -p /server

WORKDIR /server

RUN chown -R ${UID}:${GID} ./

USER ${USER}

# use build cache for npm packages
COPY --chown=${UID} server/package.json server/package-lock.json ./

RUN npm install

# copy the rest of the application
COPY --chown=${UID} server ./

CMD npm start
