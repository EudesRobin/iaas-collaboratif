#!/bin/bash


echo "Copying ssh coordinator public key"
echo "=================================="
echo
sshpass -p iaas ssh-copy-id -o "StrictHostKeyChecking no" iaas@172.17.0.1
echo
echo "=================================="
echo "Done"


exit 0
