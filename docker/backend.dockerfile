# ---- Builder: install production deps (native addons compile here if they must) ----
FROM public.ecr.aws/amazonlinux/amazonlinux:2023 AS builder

# AL2023 ships versioned Node packages; the unversioned 'nodejs' package is Node 18 (EOL and
# unpatched for the Brotli RCE CVE-2026-111497). nodejs24 resolves to Node 24.x. The runtime
# stage installs the same major so the better-sqlite3 native ABI stays compatible.
# python3/make/gcc-c++ are here only in case better-sqlite3 has to compile from source
# (node-gyp); none of them ship in the runtime image.
RUN dnf -y install \
    make \
    gcc-c++ \
    python3 \
    nodejs24 \
    nodejs24-npm \
 && dnf clean all

WORKDIR /server

# `npm ci` installs exactly what package-lock.json records, so the image matches the
# scanned lockfile instead of re-resolving semver ranges on every build.
COPY server/package.json server/package-lock.json /server/
RUN npm ci --omit=dev

COPY server /server

RUN chmod -R +x /server/bin

# ---- Runtime: Node only; npm and the build toolchain are excluded ----
# nodejs24-npm is only a weak (Recommends) dependency of nodejs24, and the npm CLI bundles its
# own vulnerable deps (tar, minimatch, glob, brace-expansion, ...) that scanners flag. npm is
# never run at runtime (pm2-runtime is started through node below), so
# --setopt=install_weak_deps=False drops it entirely.
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# Cache-bust so OS security patches actually apply on each deploy. Without this the registry
# build cache freezes the `dnf update` layer (its instruction text never changes) and OS
# packages stay pinned at an old build. The deploy workflow feeds CACHEBUST (the build datetime).
ARG CACHEBUST=unset
RUN dnf -y update \
 && dnf -y install --setopt=install_weak_deps=False nodejs24 \
 && dnf clean all

# python3 (3.9) cannot be removed from the base image (dnf depends on it) and AL2023 ships no
# build that clears the application-level CVE-2025-12781 finding ("No Fix Planned"). Agreed
# mitigation: make the interpreter executable by root only so the service process cannot
# invoke it. Nothing at runtime uses python.
RUN chmod 700 /usr/bin/python3.9

# install bedtools
ARG BEDTOOLS_VERSION=2.30.0

ARG BEDTOOLS_URL=https://github.com/arq5x/bedtools2/releases/download/v${BEDTOOLS_VERSION}/bedtools.static.binary

RUN curl -L -o /bin/bedtools ${BEDTOOLS_URL} \
 && chmod +x /bin/bedtools

WORKDIR /server

# Bring over the already-installed app (including node_modules with better-sqlite3).
COPY --from=builder /server /server

# Start pm2-runtime through node directly (same as `npm start`); npm is not installed here.
CMD ["node", "node_modules/pm2/bin/pm2-runtime", "start", "pm2.config.json", "--only", "prod"]
