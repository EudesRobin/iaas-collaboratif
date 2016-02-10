#!/bin/bash

#========================================================
# Stopping shinken
docker stop shinken
docker rm -f shinken
#========================================================

#========================================================
# Stopping coordinator
docker stop coordinator
docker rm coordinator
#========================================================

exit 0