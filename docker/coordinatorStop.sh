#!/bin/bash

#========================================================
# Stopping shinken
#docker stop shinken
#docker rm -f shinken
#========================================================

#========================================================
# Stopping shinken
docker stop cadvisor
docker rm -f cadvisor
#========================================================

#========================================================
# Stopping coordinator
coordinatorName=$(docker ps -a| grep "coordinator*"|awk '{print $(NF)}')
docker stop $coordinatorName
docker rm $coordinatorName
#========================================================

crontab -l | grep -v '* * * * * /home/iaas/watchdog.sh && sleep 30 && /home/iaas/watchdog.sh' | sudo crontab -

exit 0