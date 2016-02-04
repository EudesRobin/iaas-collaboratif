#!/bin/bash

#==============================================
# Remove old containers
docker ps -a | grep 'Exited' | awk '{print $1}'| xargs --no-run-if-empty docker rm
docker ps -a | grep 'Created' | awk '{print $1}'| xargs --no-run-if-empty docker rm
#==============================================

#==============================================
# Check existing images
isShinkenBuilt=$(docker images | grep shinken | wc -l)
isVmBuilt=$(docker images | grep vm | wc -l)
#==============================================

#==============================================
# Build all necessary images
if [[ (! $isVmBuilt == 1) ]];then
	echo "Building coordinator"
	docker build -t vm ./vm/
else
	echo "Using already built coordinator's image"
fi

if [[ (! $isShinkenBuilt == 1) ]];then
	echo "Building monitoring system"
	docker build -t shinken ./docker_shinken/shinken_basic/
else
	echo "Using already built shinken's image"
fi
#==============================================

#==============================================
# Run containers
echo "Running containers"
docker run -ti --name vm -d vm
docker run -d -v "$(pwd)/custom_configs:/etc/shinken/custom_configs" -p 8080:80 --name shinken --link vm:vmShinken shinken
#==============================================

exit 0

