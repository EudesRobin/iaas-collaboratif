#!/bin/sh

# Author : Robin Eudes

# Use : start Meteor , for our app 

cd ${HOME}/iaas-collaboratif/meteor-frontend/
meteor run -p 3000 --production &

echo "Meteor is running - Frontend is up :)"
