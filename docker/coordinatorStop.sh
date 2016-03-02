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
docker stop coordinator
docker rm coordinator
#========================================================

crontab -l | grep -v '* * * * * /home/iaas/watchdog.sh && sleep 30 && /home/iaas/watchdog.sh' | crontab -

exit 0