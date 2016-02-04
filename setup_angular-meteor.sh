#!/bin/bash

# Author : Robin Eudes

# Frontend setup

# download & install meteor 
# /!\ password asked for now

curl https://install.meteor.com/ | sh

# create project
meteor create frontend
cd frontend

# clean default files
# rm ./frontend.*

# remove Meteor's default packages
meteor remove blaze-html-templates
meteor remove ecmascript

# add angular
meteor add angular

# node.js setup
sudo apt-get install nodejs npm
# install bower , gulp
sudo npm install -g bower
sudo npm install -g gulp-cli

