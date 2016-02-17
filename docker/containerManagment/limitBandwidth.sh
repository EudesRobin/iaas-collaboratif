#!/bin/bash

#====================================
# Get iaasnetwork ip address
iaasnetworkIP=$(docker network inspect iaasnetwork | awk '/Gateway\":/{print substr($2,2,10)}')

# Get corresponding interface's name
iface=$(ifconfig | awk '/'${iaasnetworkIP}'/ {print $1}' RS="\n\n")
#====================================


#====================================
# Restrict bandwidth depending on what user specified
if [ $# -eq 0 ];then
    echo "No arguments supplied, use help to see arguments"
    exit 0
fi
if [[ "${1}" == "help" ]];then
	echo Parameters:
	echo 1. Uplink
	echo 2. Downlink
	echo You can delete this limit: ./limitBandwidth.sh reset
	exit 0
fi
if [[ "${1}" == "reset" ]];then
	echo Clearing ${iface} bandwidth restriction
	sudo wondershaper clear ${iface}
	exit 0
fi
if [ -z "$2" ]
  then
    echo "Missing argument, use help to see arguments"
    exit 0
fi
#====================================


sudo wondershaper ${iface} ${1} ${2}


exit 0
