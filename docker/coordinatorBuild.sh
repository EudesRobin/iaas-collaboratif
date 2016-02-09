#!/bin/bash


#==============================================
# Check existing images
isShinkenBuilt=$(docker images | grep shinken | wc -l)
isCoordinatorBuilt=$(docker images | grep coordinator | wc -l)
#==============================================


#==============================================
# Build all necessary images
if [[ (! $isCoordinatorBuilt == 1) ]];then
	echo "Building coordinator"
	docker build -t coordinator ./vm/
else
	echo "Using already built coordinator's image"
fi

if [[ (! $isShinkenBuilt == 1) ]];then
	echo "Building monitoring system"
	docker build -t shinken ./docker_shinken/shinken_thruk_graphite/
else
	echo "Using already built shinken's image"
fi
#==============================================