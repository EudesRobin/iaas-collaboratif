#!/bin/bash
if ! ps aux | grep -v grep | grep /home/ecom/iaas-collaboratif/meteor-frontend/.meteor/local/build/main.js > /dev/null ;then
cd /home/ecom/iaas-collaboratif/meteor-frontend/
screen -S meteor -d -m meteor run -p 3000 --production;fi
