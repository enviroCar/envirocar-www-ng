FROM node:22-alpine AS builder

# git is required by bower to fetch packages
RUN apk --no-cache add git

WORKDIR /app

COPY package.json package-lock.json bower.json /app/

# install exactly what is in the lockfile and do not run any dependency install scripts
RUN npm ci --ignore-scripts --no-audit --no-fund \
 && ./node_modules/.bin/bower --allow-root install

COPY ./ /app/

RUN ./node_modules/.bin/gulp release

FROM nginx:stable-alpine

ENV EC_BASE_URL=https://envirocar.org/auth-proxy/api \
    EC_BASE=https://envirocar.org/auth-proxy \
    EC_WEBSITE_BASE=https://envirocar.org/ \
    EC_SERVER_BASE=https://envirocar.org/api/stable


COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY ./docker-entrypoint.sh /usr/bin/docker-entrypoint.sh

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
  CMD wget http://localhost:80/ -q -O - > /dev/null 2>&1

ENTRYPOINT [ "/usr/bin/docker-entrypoint.sh" ]

CMD [ "nginx", "-g", "daemon off;" ]
