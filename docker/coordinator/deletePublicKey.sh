#!/bin/bash

#====================================
# Check if authorized_keys file is existing
# Yes => Proceed to key deletion
# No => Check that at least one container has been stopped
isAuthorized_keysExisting=$(ls|grep authorized_keys|wc -l)
#====================================


if [[ $isAuthorized_keysExisting == 1 ]];then

	#====================================
	# Read public key to be removed
	pub_key=$(cat ./authorized_keys)
	#====================================

	echo "Removing client public key in authorized_keys file"

	numberOfClientKey=$(cat /home/iaas-client/.ssh/authorized_keys|grep "$pub_key"|wc -l)
	numberOfKeyToKeep=$(( $numberOfClientKey - 1 ))

	#====================================
	# Remove public key existing in coordinator authorized key file
	touch /home/iaas-client/.ssh/tmpkeys
	cat /home/iaas-client/.ssh/authorized_keys | grep -v "$pub_key" > /home/iaas-client/.ssh/tmpkeys
	cat /home/iaas-client/.ssh/authorized_keys | grep -m $numberOfKeyToKeep "$pub_key" >> /home/iaas-client/.ssh/tmpkeys
	mv /home/iaas-client/.ssh/tmpkeys /home/iaas-client/.ssh/authorized_keys
	chmod 600 home/iaas-client/.ssh/authorized_keys
    chown iaas-client:iaas-client /home/iaas-client/.ssh/authorized_keys
	#====================================

	echo "Done"

	rm ./authorized_keys

else

	echo "No public key provided, please check that at least one container has been stopped"
	
fi


exit 0