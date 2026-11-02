#!/usr/bin/env sh

set -e

echo
echo "#"
echo "#" "Starting web."
echo "#"
echo

echo
echo "#"
echo "#" "Interpolating environment variables"
echo "#"
echo

envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js
envsubst '${APP_VERSION} ${RESOURCE_PATH_PREFIX}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf
sed "s;__PUBLIC_URL__;${PUBLIC_URL};g" -i /usr/share/nginx/html/index.html
for style in `ls /usr/share/nginx/html/static/css/*.css`;
  do
    sed -i "s|__PUBLIC_URL__|${PUBLIC_URL}|g" $style
done

echo
echo "#"
echo "#" "Starting HTTP fileserver nginx"
echo "#"
echo

exec nginx -g 'daemon off;'
