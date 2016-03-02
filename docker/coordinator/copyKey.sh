#!/bin/bash


echo "Copying ssh coordinator public key"
echo "=================================="
echo
sshpass -p iaas ssh-copy-id -i /home/iaas-admin/.ssh/id_rsa -o "StrictHostKeyChecking no" -p22000 iaas@172.17.0.1
echo
echo "=================================="
echo "Done"


exit 0
