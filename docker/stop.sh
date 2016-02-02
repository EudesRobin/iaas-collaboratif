#!/bin/bash

#========================================================
# Parameters:
# 1. Image type
# 2. Number of containers to be launched
# 3. Container name
# 4. Available memory
# 5. Unit

if [[ ( -z "${1}") ]];then
	echo Parameter:
	echo 1. Generic container name to be destroyed
	exit 0
fi
#========================================================

containerNb=$(docker ps | grep "${1}" | wc -l)

for ((i=0; i<$containerNb; i++));
do
	imgType="${1}$i"
	echo "Stopping ${imgType}"
	docker stop ${imgType}
	echo "Removing ${imgType}"
	docker rm ${imgType}
done

exit 0
