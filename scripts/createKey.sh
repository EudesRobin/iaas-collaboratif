#!/bin/bash

# Author : Romain Barthelemy

if [[ $# -ne 2 ]] ; then
    echo 'You must give 2 parameters';
    exit 0;
fi

cd ~/iaas-collaboratif/meteor-frontend/

echo "db.users.findOne({username: "\""$1"\""}).subscriber.sshKey;" | meteor mongo | awk 'NR==3' >> ../scripts/$1.pub;

scp  -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" -o "GlobalKnownHostsFile=/dev/null" -o "UserKnownHostsFile=/dev/null" -i ~/.ssh/key_project  ../scripts/$1.pub iaas-client@$2:/home/iaas-client/  &> /dev/null;
echo "Transmission key done";
rm ../scripts/$1.pub;

exit 0;
