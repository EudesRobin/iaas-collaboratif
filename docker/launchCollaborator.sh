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
# Copy public key to Dockerfile folder
cp ./frontend.pub ./vm/frontend.pub
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


exit 0