#!/bin/sh
echo "removing mobile-branding-ui website files..."
rm -rf /var/www/html/mobile-brand
if [ $? -eq 0 ]; then
  echo "successfully removed mobile-branding-ui website files."
else
  echo "failed to remove mobile-branding-ui website files."
fi
