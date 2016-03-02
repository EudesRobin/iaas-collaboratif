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
coreNumber=$(cat /proc/cpuinfo | grep 'core id' | uniq | wc -l)

k=1
while IFS=, read cpu use name sd;do
	tab[k]=$name
    k=$(($k + 1))
done < coreFile.data

for ((i=0; i<$containerNb; i++));
do
	imgType="${1}"
	docker cp $imgType:/root/.ssh/authorized_keys ./
	echo "Stopping ${imgType}"
	docker stop ${imgType}
	echo "Removing ${imgType}"
	docker rm ${imgType}
done

for ((j=$coreNumber; j>0; j--));
	do
		if [[ ${tab[j]} == ${1} ]];then
			cpu="cpu$j"
			sed -i 's/\('${cpu}',\).*/\10/' ./coreFile.data
		fi
	done

docker cp ./authorized_keys coordinator:/.

rm ./authorized_keys

exit 0
