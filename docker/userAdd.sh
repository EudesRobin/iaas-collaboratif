#!/bin/bash

#====================================
#Checking if iaas user already exists
existingIaasUser=$(cat /etc/passwd | cut -d: -f1|grep iaas|wc -l)
#====================================

if [[ (! $existingIaasUser == 1) ]];then
	echo "Creating iaas user"
	echo "iaas
iaas"|sudo adduser iaas
	createdIaasUser=$(cat /etc/passwd | cut -d: -f1|grep iaas|wc -l)
	if [[ $createdIaasUser == 1 ]];then
		echo
		echo "User successfully created"
	else
		echo "An error occured, please contact the administrator for more information"
	fi
else
	echo "Iaas user already exists, skipping this step"
fi

#===================================
#Add iaas user to Docker group
sudo gpasswd -a iaas docker
#===================================

#===================================
#Copying necessary files to iaas home
existingInitializeScript=$(ls /home/iaas/|grep initializeCore.sh|wc -l)
existingStartScript=$(ls /home/iaas/|grep start.sh|wc -l)
existingStopScript=$(ls /home/iaas/|grep stop.sh|wc -l)
existingWatchDog=$(ls /home/iaas/|grep watchdog.sh|wc -l)
existingBandwidth=$(ls /home/iaas/|grep limitBandwidth.sh.sh|wc -l)
if [[ (! $existingInitializeScript == 1) ]];then
	sudo cp -pr ./containerManagment/initializeCore.sh /home/iaas/
fi
if [[ (! $existingStartScript == 1) ]];then
	sudo cp -pr ./containerManagment/start.sh /home/iaas/
fi
if [[ (! $existingStopScript == 1) ]];then
	sudo cp -pr ./containerManagment/stop.sh /home/iaas/
fi
if [[ (! $existingWatchDog == 1) ]];then
	sudo cp -pr ./containerManagment/watchdog.sh /home/iaas/
fi
if [[ (! $existingBandwidth == 1) ]];then
	sudo cp -pr ./containerManagment/limitBandwidth.sh /home/iaas/
fi
#===================================

exit 0