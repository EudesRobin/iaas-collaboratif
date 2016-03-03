#!/bin/bash

existingWatchDogFile=$(ls /home/iaas/|grep watchdog.data|wc -l)

if [[ ( $existingWatchDogFile == 1) ]];then
	rm /home/iaas/watchdog.data
fi

existingJSON=$(ls /home/iaas/|grep instances.data|wc -l)

if [[ ( $existingJSON == 1) ]];then
	rm /home/iaas/instances.data
fi

#========================================================
k=0
containerNumber=$(docker ps|wc -l)
containerNumber=$(( $containerNumber - 1 ))

echo "[" >> /home/iaas/instances.data
docker ps -s | awk '{print $(NF-5),$(NF-4),$(NF-3)}' > /home/iaas/watchdog.data
while IFS=' '  read container size unit;do
	if [[ !($k == 0) ]];then
		docker inspect --type=container --size --format='{{json .}}' $container >> /home/iaas/instances.data
		if [[ !($k == $containerNumber) ]];then
				echo "," >> /home/iaas/instances.data
		fi
		while IFS=, read cpu use name sd;do
			read u <<< $(sed -r 's/^[0-9]+//' <<< ${sd})
			read s <<< $(sed -r 's/[A-Z]+//' <<< ${sd})
			#========================================================
			# Setting maximum size
			maximumSize=$s
			if [[ "$u" == "T" ]];then
				maximumSize=$(( $maximumSize * 1024 * 1024 * 1024 * 1024 ))
			fi
			if [[ "$u" == "G" ]];then
				maximumSize=$(( $maximumSize * 1024 * 1024 * 1024 ))
			fi
			if [[ "$u" == "M" ]];then
				maximumSize=$(( $maximumSize * 1024 * 1024 ))
			fi
			#========================================================
			if [ "$name" == "$container" ];then
				size=${size%.*}
				if [[ "$unit" == "GB" ]];then
					size=$(( $size * 1024 * 1024 * 1024 ))
				fi
				if [[ "$unit" == "MB" ]];then
					size=$(( $size * 1024 * 1024 ))
				fi
				if [[ "$unit" == "kB" ]];then
					size=$(( $size * 1024 ))
					fi
				if [[ $size -gt  $maximumSize ]];then
					echo "Stopping $container : $size $unit"
					/home/iaas/stop.sh $container
				fi
			fi
		done < /home/iaas/coreFile.data
	fi
	k=$(( $k + 1 ))
done < /home/iaas/watchdog.data
echo "]" >> /home/iaas/instances.data
docker cp /home/iaas/instances.data coordinator:./publisher/

exit 0
