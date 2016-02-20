#!/bin/sh

# Author : Robin Eudes

# Use : start Meteor , for our app 
if ! test "${HOME}/iaas-collaboratif"
then
	echo "folder ${HOME}/iaas-collaboratif not found"
	exit 1
else
	${HOME}/iaas-collaboratif/scripts/check_running.sh
	echo "Meteor started..."
fi
