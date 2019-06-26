FROM node:11-alpine AS BUILDER

RUN apk --no-cache add make g++ python git

WORKDIR /app

COPY package.json bower.json /app/

RUN npm install \
 && npm install bower \
 && ./node_modules/.bin/bower --allow-root install

COPY ./ /app/

RUN ./node_modules/.bin/gulp release

FROM nginx:alpine

ENV EC_BASE_URL=https://envirocar.org/auth-proxy/api \
    EC_BASE=https://envirocar.org/auth-proxy \
    EC_WEBSITE_BASE=https://envirocar.org/ \
    EC_SERVER_BASE=https://envirocar.org/api/stable


COPY --from=BUILDER /app/index.html /app/release.js /usr/share/nginx/html/
COPY --from=BUILDER /app/app                        /usr/share/nginx/html/app
COPY --from=BUILDER /app/bower_components           /usr/share/nginx/html/bower_components
COPY ./docker-entrypoint.sh /usr/bin/docker-entrypoint.sh

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
  CMD wget http://localhost:80/ -q -O - > /dev/null 2>&1

ENTRYPOINT [ "/usr/bin/docker-entrypoint.sh" ]

CMD [ "nginx", "-g", "daemon off;" ]