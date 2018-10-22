FROM gcr.io/web-infra/nginx-static-site:1.9-1
LABEL maintainer web-infra-squad@spotify.com
COPY build/ /srv/www
