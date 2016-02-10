#!/bin/bash

#====================================
# Create user and copy necessary files to user's home directory
./userAdd.sh
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