#!/bin/bash


#==============================================
# Remove old containers
docker ps -a | grep 'Exited' | awk '{print $1}'| xargs --no-run-if-empty docker rm
docker ps -a | grep 'Created' | awk '{print $1}'| xargs --no-run-if-empty docker rm
#==============================================


#==============================================
# Clean coreFile.data
./initializeCore.sh
#==============================================


#==============================================
# Checking if images are already existing
# Build only necessary images
./coordinatorBuild.sh
#==============================================


#==============================================
# Run containers
echo "Running containers"
docker run -ti --name vm -d vm
docker run -d -v "$(pwd)/docker_shinken/shinken_thruk_graphite/custom_configs:/etc/shinken/custom_configs" -p 81:80 --name shinken --link vm:vmShinken shinken
#==============================================

exit 0

