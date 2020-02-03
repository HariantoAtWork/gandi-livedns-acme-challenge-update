#!/bin/sh
docker run -v $PWD/APIKEY:/home/node/app/APIKEY:ro --rm -it harianto/gandi-acme-challenge
