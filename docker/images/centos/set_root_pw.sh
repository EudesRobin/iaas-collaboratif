#!/bin/bash

if [ -f /.root_pw_set ]; then
	echo "Root password already set!"
	exit 0
fi

echo "root:iaas" | chpasswd

echo "=> Done!"
touch /.root_pw_set


