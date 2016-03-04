#!/bin/bash

if ! docker top coordinator &>/dev/null
	then
	if ! docker top cadvisor &>/dev/null
		then
		# both are not running , for example at start...
		./startProvider.sh
	fi
	# Only coordinator is not running
	docker run -ti -p 22:22 --expose 22 --net=iaasnetwork --name coordinator -d coordinator
fi


# Only cadvisor is not running
if ! docker top cadvisor &>/dev/null
	then
	docker run --net=iaasnetwork \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:rw \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest
fi
