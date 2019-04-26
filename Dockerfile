FROM node:alpine AS BUILDER

RUN apk --no-cache add make g++ python git

WORKDIR /app

COPY package.json bower.json /app/

RUN npm install \
 && npm install bower \
 && ./node_modules/.bin/bower --allow-root install

COPY ./ /app/

RUN ./node_modules/.bin/gulp release

FROM nginx:alpine

COPY --from=BUILDER /app/index.html        /usr/share/nginx/html/index.html
COPY --from=BUILDER /app/release.js        /usr/share/nginx/html/release.js
COPY --from=BUILDER /app/app               /usr/share/nginx/html/app
COPY --from=BUILDER /app/bower_components/ /usr/share/nginx/html/bower_components

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
  CMD wget http://localhost:80/ -q -O - > /dev/null 2>&1
