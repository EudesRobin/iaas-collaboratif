#!/bin/bash

# Wrong parameters and empty parameters? => Need to be handled

#========================================================
# Parameters:
# 1. Image type
# 2. Number of containers to be launched
# 3. Container name
# 4. Available memory
# 5. Unit

if [[ "${1}" == "help" ]];then
	echo Parameters:
	echo 1. Image type
	echo 2. Number of containers to be launched
	echo 3. Container name
	echo 4. Memory of 1 container
	echo 5. Memory unit: M,G,T 
	echo 6. Number of CPU going to be used by 1 container
	echo 7. Number of CPU already allocated
	exit 0
fi
#========================================================


#========================================================
# Checking the number of container to launch
if [[ (! -z "${2}") ]];then
	containerNb=${2}
else
	containerNb=1
fi
#========================================================

aM=${4}

#========================================================
# Allocating memory depending on total memory available
# and number of container to launch
if [[ "${5}" == "M" ]];then
	allocatedMemory=$aM
	allocatedMemory+=M
fi
if [[ "${5}" == "G" ]];then
	allocatedMemory=$(( $aM * 1024 ))
	allocatedMemory+=M
fi
if [[ "${5}" == "T" ]];then
	allocatedMemory=$(( $aM * 1024 * 1024 ))
	allocatedMemory+=M
fi
#========================================================

coreNumber=$(cat /proc/cpuinfo | grep 'core id' | uniq | wc -l)
processorNumber=$(cat /proc/cpuinfo | grep 'processor' | uniq | wc -l)
hyperthreadValue=$(( $processorNumber / coreNumber ))

#========================================================
# Launching containers
for ((i=0; i<$containerNb; i++));
do
	#====================================================
	# Allocating CPU share
	nbCPUMax=$(($processorNumber-1-(${7} * $hyperthreadValue)-($i * $hyperthreadValue)))
	nbCPUMin=$(($processorNumber-($i * $hyperthreadValue)-(${7} * $hyperthreadValue)-(${6} * $hyperthreadValue)))
	cpuset="$nbCPUMin-$nbCPUMax"
	#====================================================
	imgType="${3}$i"
	echo "Running ${imgType} with "$allocatedMemory" of memory" 
	docker run -ti -d -m $allocatedMemory --cpuset-cpus="$cpuset" --name $imgType --link vm:vm$imgType ${1}
done
#========================================================

#docker exec -ti $imgType bin/bash

exit 0
