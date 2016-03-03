#!/bin/bash
docker exec -i coordinator sh -c "cat ${1} >> /home/iaas-client/.ssh/authorized_keys;rm ${1};"