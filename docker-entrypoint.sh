#!/bin/sh -e

sed -i  /usr/share/nginx/html/config.js \
  -e 's@https://envirocar.org/auth-proxy/api@'${EC_BASE_URL}'@g' \
  -e 's@https://envirocar.org/auth-proxy@'${EC_BASE}'@g' \
  -e 's@https://envirocar.org/@'${EC_WEBSITE_BASE}'@g' \
  -e 's@https://envirocar.org/api/stable@'${EC_SERVER_BASE}'@g'

exec "$@"