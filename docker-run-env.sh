#!/bin/sh
docker run -e APIKEY="($(<APIKEY))" --rm -it harianto/gandi-acme-challenge
