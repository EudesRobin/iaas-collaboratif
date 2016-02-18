#!/bin/bash


#====================================
# Create user and copy necessary files to user's home directory
./userAdd.sh
#====================================


#====================================
# Check if wondershaper is installed
isWondershaperInstalled=$(dpkg -l | grep wondershaper | wc -l)
if [[ $isWondershaperInstalled == 0 ]];then
	sudo apt-get install -y wondershaper
fi
#====================================


#====================================
#Add iaas user to sudoer group for wondershaper
iaasPermission=$(sudo cat /etc/sudoers | grep iaas)
if [[ "${iaasPermission}" == "iaas ALL=(ALL) NOPASSWD: /sbin/wondershaper" ]];then
	echo "Iaas permission already set"
else
	echo "Allow iaas user to use wondershaper"
	sudo bash -c 'echo "iaas ALL=(ALL) NOPASSWD: /sbin/wondershaper" | (EDITOR="tee -a" visudo)'
fi
#====================================


#====================================
# Copy public key to Dockerfile folder if not already existing
isPublicKeyAlreadySet=$(ls ./coordinator/|grep "frontend.pub"|wc -l)
if [[ $isPublicKeyAlreadySet == 0 ]];then
	cp ./frontend.pub ./coordinator/frontend.pub
fi
#====================================


#====================================
# Build coordinator and shinken images and launch associated containers
./coordinatorStart.sh
#====================================


#====================================
# Build images
docker build -t ubuntussh ./images/ubuntu/
docker build -t centosssh ./images/centos/
docker build -t debianssh ./images/debian/
#====================================

sudo /home/iaas/initializeCore.sh

exit 0