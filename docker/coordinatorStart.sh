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
dockerAlreadyExisting=$(docker ps -a|grep "coordinator*"|awk '{print $(NF)}'|wc -l)
if [[ ($dockerAlreadyExisting == 1) ]];then
	echo "Launching old coordinator container"
	coordinatorName=$(docker ps -a| grep "coordinator*"|awk '{print $(NF)}')
	docker start $coordinatorName
else
  docker run -ti -p 22:22 --expose 22 --net=iaasnetwork --name coordinator -d coordinator
fi

cadvisorAlreadyExisting=$(docker ps -a|grep "cadvisor"|awk '{print $(NF)}'|wc -l)
if [[ ($cadvisorAlreadyExisting == 1) ]];then
  echo "Launching old cAdvisor container"
  docker start cadvisor
else
  #We found out a new monitoring system that seems to be more that enough for what we need
  docker run --net=iaasnetwork \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:rw \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest
  #docker run -d --net=iaasnetwork -v "$(pwd)/docker_shinken/shinken_thruk_graphite/custom_configs:/etc/shinken/custom_configs" -p 81:80 --name shinken shinken
  #==============================================
fi


exit 0

