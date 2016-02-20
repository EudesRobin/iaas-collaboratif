#!/bin/sh

# Author : Robin Eudes


if [ ! -d "${HOME}/iaas-collaboratif" ];
then
	echo "folder ${HOME}/iaas-collaboratif not found"
	exit 1;
else
	${HOME}/iaas-collaboratif/scripts/check_running.sh
	echo "Meteor started...";
fi
