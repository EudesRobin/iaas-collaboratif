#!/bin/bash

#====================================
if [[ "${1}" == "help" ]];then
	echo Parameter:
	echo 1. The file corresponding to the client public key
	exit 0
fi
#====================================


#====================================
# Copy client public key as "authorized_keys" in the iaas user home
# This file will be automatically copied in every new container run
scp -P 22000 -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5"  -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null" ${1} iaas@172.17.0.1:./authorized_keys
#====================================


#====================================
# Copy key to coordinator authorized_keys file 
ssh -p 22000 iaas@172.17.0.1 "docker exec -ti coordinator cat ${1} >> /home/iaas-client/.ssh/authorized_keys"
#====================================

exit 0
