#!/bin/bash

existingCoreFile=$(ls /home/iaas/|grep coreFile.data|wc -l)

if [[ $existingCoreFile == 1 ]];then
	rm /home/iaas/coreFile.data
fi

coreNumber=$(cat /proc/cpuinfo | grep 'core id' | uniq | wc -l)

for ((i=1; i<=$coreNumber; i++));
do
	echo cpu$i,0 >> /home/iaas/coreFile.data
done

exit 0
