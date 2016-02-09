#!/bin/bash

existingCoreFile=$(ls|grep coreFile.data|wc -l)

if [[ $existingCoreFile == 1 ]];then
	rm coreFile.data
fi

coreNumber=$(cat /proc/cpuinfo | grep 'core id' | uniq | wc -l)

for ((i=1; i<=$coreNumber; i++));
do
	echo cpu$i,0 >> coreFile.data
done

exit 0
