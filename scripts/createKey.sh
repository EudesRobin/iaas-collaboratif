#!/bin/bash

# Author : Romain Barthelemy
cd ../meteor-frontend/

echo "db.users.findOne({_id : "\""$1"\""}).subscriber.sshKey;" | meteor mongo >> ../scripts/$1.pub