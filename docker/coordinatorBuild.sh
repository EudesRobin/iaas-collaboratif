#!/bin/bash


#==============================================
# Check existing images
isShinkenBuilt=$(docker images | grep shinken | wc -l)
isCoordinatorBuilt=$(docker images | grep coordinator | wc -l)
#==============================================

#========================================================
if [[ "${1}" == "update" ]];then
	if [[ "${2}" == "coordinator" ]];then
		#Remove previous coordinator public key
		sudo rm /home/iaas/.ssh/authorized_keys
		docker build -t coordinator ./coordinator/
	fi
	if [[ "${2}" == "shinken" ]];then
		docker build -t shinken ./docker_shinken/shinken_thruk_graphite/
	fi
	if [[ "${2}" == "all" ]];then
		docker build -t coordinator ./coordinator/
		docker build -t shinken ./docker_shinken/shinken_thruk_graphite/
	fi
#========================================================
else
#==============================================
	# Build all necessary images
	if [[ (! $isCoordinatorBuilt == 1) ]];then
		#Remove previous coordinator public key
		sudo rm /home/iaas/.ssh/authorized_keys
		echo "Building coordinator"
		docker build -t coordinator ./coordinator/
	else
		echo "Using already built coordinator's image"
	fi

	if [[ (! $isShinkenBuilt == 1) ]];then
		echo "Building monitoring system"
		docker build -t shinken ./docker_shinken/shinken_thruk_graphite/
	else
		echo "Using already built shinken's image"
	fi
fi
#==============================================