#!/bin/bash

#Author : Eudes Robin

if ! ps aux | grep -v grep | grep ${HOME}/iaas-collaboratif/meteor-frontend/.meteor/local/build/main.js > /dev/null ;then
cd ${HOME}/iaas-collaboratif/meteor-frontend/
screen -S meteor -d -m meteor run -p 3000 --production;fi
