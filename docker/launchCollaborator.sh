#!/bin/bash

#====================================
# Create user and copy necessary files to user's home directory
./userAdd.sh
#====================================

#====================================
# Build coordinator and shinken images and launch associated containers
./coordinatorStart.sh
#====================================

exit 0