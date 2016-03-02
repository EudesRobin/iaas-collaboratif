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

exit 0