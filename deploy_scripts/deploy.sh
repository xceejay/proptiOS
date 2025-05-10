 #!/bin/bash


DOMAIN="api.pm.proptios.com"
# AVAILABLE_PATH="/etc/nginx/sites-available/$DOMAIN"
# ENABLED_PATH="/etc/nginx/sites-enabled/$DOMAIN"
# URI='$uri'

# configure_nginx(){

# cat << EOF > $AVAILABLE_PATH

# server {
#     listen 80;
#     server_name $DOMAIN www.$DOMAIN;
#     root /var/www/$DOMAIN;

#     index index.html index.htm index.php;

#     location / {
#         try_files $URI $URI/ =404;
#     }

#     location ~ \.php$ {
#         include snippets/fastcgi-php.conf;
#         fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
#      }

#     location ~ /\.ht {
#         deny all;
#     }

# }

# EOF

# ln -sf $AVAILABLE_PATH $ENABLED_PATH

# systemctl restart nginx

# }


# if [ -f  $ENABLED_PATH ]; then
#   exit 0
# else
#   configure_nginx
# fi

#
cp -r /var/www/mh-api-modules/node_modules  /var/www/$DOMAIN/ &&  cp  /var/www/mh-api-modules/.env /var/www/$DOMAIN/ &&  cd   /var/www/$DOMAIN/ && npm install &&  cd ~/pm2-proptios/ && pm2 restart "PM API"
# cd   /var/www/$DOMAIN/ && npm install &&  cd ~/pm2-ecosystem/ && pm2 restart "PM API"

