FROM node:13-alpine

ENV HOME=/home/node
ENV NODE_WORKDIR=$HOME/app
COPY --chown=node:node . $NODE_WORKDIR/

WORKDIR $NODE_WORKDIR
ENTRYPOINT ["./gandiAcmeChallenge.js"]