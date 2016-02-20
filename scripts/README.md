Collaborative IaaS with Docker
==============================

[![Stories in Ready](https://badge.waffle.io/EudesRobin/iaas-collaboratif.png?label=ready&title=Ready)](https://waffle.io/EudesRobin/iaas-collaboratif)

**Authors :** 
Alan DAMOTTE, Robin EUDES, Romain BARTHELEMY, Malek MAMMAR, Kai GUO, BONNARD Loïc, CAPERAN Théo


How to use them  ?
---------------
    .
    ├── check_running.sh
    ├── createKey.sh
    ├── kill-meteor.sh
    ├── README.md
    ├── setup_angular-meteor.sh
    └── start-meteor-frontend.sh

**setup_angular-meteor.sh :**
Install Meteor , nodeJS, gulp, bower, fibers, and everything that might be needed by others scripts (like screen)

**start-meteor-frontend.sh :**
It will start the meteor project in a screen session.

    screen -r meteor to get it in your terminal
    ctrl+A and press D to detach the session to exit

This script assume that to project have be clone at the root of your home folder
    ~/iaas-collaboratif/ ....

**kill-meteor.sh :**
Kill meteor proccess.

**check_running.sh :**
Check if the project is already running, if not start it, in a screen session ( see start-meteor-frontend ).
If fact, the start-scrip call this one ;)

**createKey.sh :**
We will need to get user SSH public key, to send it to coordinator's provider node, and at the end, to user's instances.

Links
-------
[Documentation](http://air.imag.fr/index.php/Projets-2015-2016-IaaS_Docker)

[Kanban - Waffle](https://waffle.io/EudesRobin/iaas-collaboratif)

Licence
-------
[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.fr.html)