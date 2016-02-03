#!/bin/bash

# Wrong parameters and empty parameters? => Need to be handled

#========================================================
if [[ "${1}" == "help" ]];then
	echo Parameters:
	echo 1. Image type
	echo 2. Number of containers to be launched
	echo 3. Container name
	echo 4. Memory of 1 container \(don\'t forget unit\)
	echo 5. Number of CPU going to be used by 1 container
	echo 6. Memory available set by the collaborator \(don\'t forget unit\)
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
memoryHardLimit=${6}
memorySoftLimit=${4}

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
			nbCPUMin=$((($j * $hyperthreadValue)-(${5} * $hyperthreadValue)))
			cpuset="$nbCPUMin-$nbCPUMax"

			#============================================
			# Running docker containers
			imgType="${3}$i"
			echo "Running ${imgType} with "$allocatedMemory" of memory" 
			docker run -ti -d -m $memoryHardLimit --memory-reservation $memorySoftLimit --cpuset-cpus="$cpuset" --name $imgType --link vm:vm$imgType ${1}
			for ((l=0; l<${5}; l++));
			do
				#========================================
				# Updating CPU usage in coreFile.data
				id=$(( $j - $l ))
				cpu="cpu$id"
				sed -i 's/\('${cpu}',\).*/\11,'${imgType}'/' ./coreFile.data
				#========================================
			done
			
			break
		fi
	done
done
#========================================================

exit 0
