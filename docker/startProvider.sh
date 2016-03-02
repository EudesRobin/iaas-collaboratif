#!/bin/bash


#====================================
# Checking if Docker is already installed

isDockerInstalled=$(dpkg -l docker &> /dev/null && echo "1")

if [[ !($isDockerInstalled == 1) ]];then
	sudo apt-get update
	sudo apt-get install docker-engine
	sudo groupadd docker
	sudo gpasswd -a ${USER} docker
	sudo service docker restart
	newgrp docker
else
	echo "Docker is already installed, skipping this step."
fi	
#====================================

sudo apt-get install cron

#====================================
# Checking if SSH is already installed

isSSHInstalled=$(sudo service ssh status &> /dev/null && echo "1")

if [[ !($isSSHInstalled == 1) ]];then
	sudo apt-get install openssh-server
else
	echo "SSH server already installed, skipping this step."
fi

isPortSet=$(grep "Port 22000" < /etc/ssh/sshd_config|wc -l)
if [[ !($isPortSet == 1) ]];then
	sudo sed -i 's/Port 22/Port 22000/g' /etc/ssh/sshd_config	
	sudo service ssh restart
fi
#====================================


#====================================
# Create user and copy necessary files to user's home directory
./userAdd.sh
#====================================


#====================================
# Check if wondershaper is installed
isWondershaperInstalled=$(dpkg -l | grep wondershaper | wc -l)
if [[ $isWondershaperInstalled == 0 ]];then
	sudo apt-get install -y wondershaper
fi
#====================================


#====================================
#Add iaas user to sudoer group for wondershaper
iaasPermission=$(sudo cat /etc/sudoers | grep iaas)
if [[ "${iaasPermission}" == "iaas ALL=(ALL) NOPASSWD: /sbin/wondershaper" ]];then
	echo "Iaas permission already set"
else
	echo "Allow iaas user to use wondershaper"
	sudo bash -c 'echo "iaas ALL=(ALL) NOPASSWD: /sbin/wondershaper" | (EDITOR="tee -a" visudo)'
fi
#====================================


#====================================
# Copy public key to Dockerfile folder if not already existing
isPublicKeyAlreadySet=$(ls ./coordinator/|grep "frontend.pub"|wc -l)
if [[ $isPublicKeyAlreadySet == 0 ]];then
	cp ./frontend.pub ./coordinator/frontend.pub
fi
#====================================


#====================================
# Build coordinator and shinken images and launch associated containers
./coordinatorStart.sh
#====================================

#====================================
# Setting instance.data file which will be send by rabbitmq
containerNumber=$(docker ps|wc -l)
containerNumber=$(( $containerNumber - 1 ))
echo "[" >> ./instances.data
k=0
docker ps -s | awk '{print $(NF-5),$(NF-4),$(NF-3)}' > ./watchdog.data
while IFS=' '  read container size unit;do
	if [[ !($k == 0) ]];then
		docker inspect --type=container --size --format='{{json .}}' $container >> ./instances.data
		if [[ !($k == $containerNumber) ]];then
			echo "," >> ./instances.data
		fi
	fi
	k=$(( $k + 1 ))
done < ./watchdog.data
echo "]" >> ./instances.data
docker cp ./instances.data coordinator:./publisher/
sudo rm ./instances.data
sudo rm ./watchdog.data
#====================================

#====================================
# Build images
docker build -t ubuntussh ./images/ubuntu/
docker build -t centosssh ./images/centos/
docker build -t debianssh ./images/debian/
#====================================

sudo /home/iaas/initializeCore.sh

docker exec -d coordinator ./publisher/sendInformationAboutContainers.sh

#====================================
#Create new cron job that will execute watchdog
(crontab -l 2>/dev/null; echo "* * * * * /home/iaas/watchdog.sh && sleep 30 && /home/iaas/watchdog.sh") | crontab -
#====================================

exit 0