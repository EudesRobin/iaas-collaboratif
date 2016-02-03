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


#========================================================
# Allocating memory
allocatedMemory=${4}${5}
#========================================================

coreNumber=$(cat /proc/cpuinfo | grep 'core id' | uniq | wc -l)
processorNumber=$(cat /proc/cpuinfo | grep 'processor' | uniq | wc -l)
hyperthreadValue=$(( $processorNumber / coreNumber ))

#========================================================
# Launching containers
for ((i=0; i<$containerNb; i++));
do
	#=====================================================
	#Checking used proc
	k=1
	while IFS=, read xx yy;do
		tab[k]=$yy
	     k=$(($k + 1))
	done < coreFile.data
	#====================================================
	for ((j=$coreNumber; j>0; j--));
	do
		if [[ ${tab[j]} == 0 ]];then

			#============================================
			# Allocating CPU share
			nbCPUMax=$((($j * $hyperthreadValue)-1))
			nbCPUMin=$((($j * $hyperthreadValue)-(${6} * $hyperthreadValue)))
			cpuset="$nbCPUMin-$nbCPUMax"

			#============================================
			imgType="${3}$i"
			echo "Running ${imgType} with "$allocatedMemory" of memory" 
			docker run -ti -d -m $allocatedMemory --cpuset-cpus="$cpuset" --name $imgType --link vm:vm$imgType ${1}
			for ((l=0; l<${6}; l++));
			do
				id=$(( $j - $l ))
				cpu="cpu$id"
				sed -i 's/\('${cpu}',\).*/\11,'${imgType}'/' ./coreFile.data
			done
			
			break
		fi
	done
done
#========================================================

#docker exec -ti $imgType bin/bash

exit 0


#nbCPUMax=$((($j * $hyperthreadValue)-1-(${7} * $hyperthreadValue)-($i * $hyperthreadValue)))
#nbCPUMin=$((($j * $hyperthreadValue)-($i * $hyperthreadValue)-(${7} * $hyperthreadValue)-(${6} * $hyperthreadValue)))
#cpuset="$nbCPUMin-$nbCPUMax"