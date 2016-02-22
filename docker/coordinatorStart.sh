#!/bin/bash


#==============================================
# Remove old containers
docker ps -a | grep 'Exited' | awk '{print $1}'| xargs --no-run-if-empty docker rm
docker ps -a | grep 'Created' | awk '{print $1}'| xargs --no-run-if-empty docker rm
#==============================================


#==============================================
# Clean coreFile.data
sudo /home/iaas/initializeCore.sh
#==============================================


#==============================================
# Checking if images are already existing
# Build only necessary images
./coordinatorBuild.sh
#==============================================

existingNetwork=$(docker network ls|grep iaasnetwork|wc -l)
if [[ (! $existingNetwork == 1) ]];then
	docker network create iaasnetwork
fi

#==============================================
# Run containers
echo "Running containers"
docker run -ti -p 22:22 --expose 22 --net=iaasnetwork --name coordinator -d coordinator
docker run -d --net=iaasnetwork -v "$(pwd)/docker_shinken/shinken_thruk_graphite/custom_configs:/etc/shinken/custom_configs" -p 81:80 --name shinken shinken
#==============================================

exit 0

