#!/bin/bash

#====================================
# Create user and copy necessary files to user's home directory
./userAdd.sh
#====================================

#====================================
# Build coordinator and shinken images and launch associated containers
./coordinatorStart.sh
#====================================

#====================================
# Copy public key to Dockerfile folder
cp ./frontend.pub ./images/centos/frontend.pub
cp ./frontend.pub ./images/ubuntu/frontend.pub
cp ./frontend.pub ./images/debian/frontend.pub
#====================================

#====================================
# Build images
docker build -t ubuntussh ./images/ubuntu/
docker build -t centosssh ./images/centos/
docker build -t debianssh ./images/debian/
#====================================

exit 0