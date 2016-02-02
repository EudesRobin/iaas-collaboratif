#!/bin/bash

isShinkenBuilt=$(docker images | grep shinken | wc -l)
isVmBuilt=$(docker images | grep shinken | wc -l)

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

echo "Running containers"
docker run -ti --name vm -d vm
docker run -d -v "$(pwd)/custom_configs:/etc/shinken/custom_configs" -p 8080:80 --name shinken --link vm:vmShinken shinken

exit 0

#docker run -ti -d --name nagios --link vm:vmNagios -h nagios -p 8080:80 nagios
