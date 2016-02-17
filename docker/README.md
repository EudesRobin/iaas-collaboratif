[![Stories in Ready](https://badge.waffle.io/EudesRobin/iaas-collaboratif.png?label=ready&title=Ready)](https://waffle.io/EudesRobin/iaas-collaboratif)

Collaborative IaaS with Docker
==============================

**Authors :** 
Alan DAMOTTE, Robin EUDES, Romain BARTHELEMY, Malek MAMMAR, Kai GUO, BONNARD Loïc, CAPERAN Théo

---------------------------

Archive content
----------------------

**Scripts:**

 - coordinatorBuild: *used to build coordinator and shinken images*
 - coordinatorStart: *used to start coordinator and shinken images*
 - coordinatorStop: *used to stop coordinator and shinken images*
 - userAdd: *add iaas user to host*
 - startProvider: *main script that create iaas user, build all images, and start coordinator and monitoring containers*

**Folders:**

 - containerManagment: *contains all the scripts which are copied to iaas user home and will be used to manage containers*
 - coordinator: *contains Dockerfile and script to initialize coordinator image*
 - docker_shinken: contains Dockerfiles and scripts to initialize monitoring image
 - images: contains Dockerfiles and scripts to initialize main images (ubuntu, debian, centos)

How to use the scripts?
----------------------

1. To **initialize and start** coordinator and monitoring containers:

	> ./startProvider.sh

2. To **start** coordinator and monitoring containers (will have no effect if they are already started):

	> ./coordinatorStart.sh

3. To **stop** coordinator and monitoring containers:

	> ./coordinatorStop.sh

4. If you need to update coordinator *or* shinken image:

	- Update coordinator image

		> ./coordinatorBuild.sh update coordinator

	- Update shinken image

		> ./coordinatorBuild.sh update shinken

	- Update both coordinator and shinken image

		> ./coordinatorBuild.sh update all


*There is no need to use the other scripts the archive contains.*

----------

Licence
-------

[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.fr.html)


