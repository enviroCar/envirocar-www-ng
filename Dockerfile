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

ENV EC_BASE_URL https://envirocar.org/auth-proxy/api
ENV EC_BASE https://envirocar.org/auth-proxy
ENV EC_WEBSITE_BASE https://envirocar.org/
ENV EC_SERVER_BASE https://envirocar.org/api/stable

COPY --from=BUILDER /app/index.html        /usr/share/nginx/html/index.html
COPY --from=BUILDER /app/release.js        /usr/share/nginx/html/release.js
COPY --from=BUILDER /app/app               /usr/share/nginx/html/app
COPY --from=BUILDER /app/bower_components/ /usr/share/nginx/html/bower_components

CMD ["sh", "-c",  "sed -i -e 's@https://envirocar.org/auth-proxy/api@'${EC_BASE_URL}'@g' /usr/share/nginx/html/app/config.js \ 
                && sed -i -e 's@https://envirocar.org/auth-proxy@'${EC_BASE}'@g' /usr/share/nginx/html/app/config.js \
                && sed -i -e 's@https://envirocar.org/@'${EC_WEBSITE_BASE}'@g' /usr/share/nginx/html/app/config.js \
                && sed -i -e 's@https://envirocar.org/api/stable@'${EC_SERVER_BASE}'@g' /usr/share/nginx/html/app/config.js \
                && nginx -g 'daemon off;'"]