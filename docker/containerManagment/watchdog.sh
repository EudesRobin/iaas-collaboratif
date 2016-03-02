#!/bin/bash

existingWatchDogFile=$(ls|grep watchdog.data|wc -l)

if [[ (! $existingWatchDogFile == 1) ]];then
	touch watchdog.data
fi

existingJSON=$(ls|grep instances.data|wc -l)

if [[ (! $existingJSON == 1) ]];then
	touch instances.data
fi

#========================================================
k=0
containerNumber=$(docker ps|wc -l)
containerNumber=$(( $containerNumber - 1 ))
rm watchdog.data
rm instances.data
echo "[" >> instances.data
docker ps -s | awk '{print $(NF-5),$(NF-4),$(NF-3)}' > watchdog.data
while IFS=' '  read container size unit;do
	if [[ !($k == 0) ]];then
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
				docker inspect --type=container --size --format='{{json .}}' $container >> instances.data
				if [[ !($k == $containerNumber) ]];then
						echo "," >> ./instances.data
				fi
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
					./stop.sh $container
				fi
			fi
		done < coreFile.data
	fi
	k=$(( $k + 1 ))
done < watchdog.data
echo "]" >> instances.data
docker cp ./instances.data coordinator:./publisher/
sleep 30s
done
