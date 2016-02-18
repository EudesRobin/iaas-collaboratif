#!/bin/bash

# Author : Romain Barthelemy
cd ../meteor-frontend/

echo "db.users.findOne({_id : "\""$1"\""}).subscriber.sshKey;" | meteor mongo | awk 'NR==3' >> ../scripts/$1.pub

scp ../scripts/$1.pub nodetest@$2:$1.pub