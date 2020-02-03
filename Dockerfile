FROM node:13-alpine

RUN apk update && apk upgrade
RUN apk --update add \
    git \
    bash \
    python \
    openssl \
    libgcc \
    make \
    libstdc++ \
    g++ \
    nano

ENV HOME=/home/node
ENV NODE_WORKDIR=$HOME/app
COPY --chown=node:node . $NODE_WORKDIR/

WORKDIR $NODE_WORKDIR
ENTRYPOINT ["./gandiAcmeChallenge.js"]