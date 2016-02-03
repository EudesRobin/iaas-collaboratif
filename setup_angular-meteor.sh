#!/bin/bash

# Author : Robin Eudes

# Frontend setup

# download & install meteor 
# /!\ password asked for now
cd ~
curl https://install.meteor.com/ | sh

# create project
meteor create frontend
cd frontend

# clean default files
rm ./*

# remove Meteor's default packages
meteor remove blaze-html-templates
meteor remove ecmascript

# add angular
meteor add angular








