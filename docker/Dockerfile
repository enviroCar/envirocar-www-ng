FROM nginx
MAINTAINER "Arne de Wall <a.dewall@52north.org"

ARG DEFAULT_SITE_CONF
ARG SOURCES_DIR
# ARG STARTUP_SCRIPT

COPY ${SOURCES_DIR} /usr/share/nginx/html
COPY ${STARTUP_SCRIPT} ./startup.sh

# CMD ["./startup.sh"]