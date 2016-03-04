Collaborative IaaS with Docker
==============================
[![Stories in Ready](https://badge.waffle.io/EudesRobin/iaas-collaboratif.png?label=ready&title=Ready)](https://waffle.io/EudesRobin/iaas-collaboratif)

[![Throughput Graph](https://graphs.waffle.io/EudesRobin/iaas-collaboratif/throughput.svg)](https://waffle.io/EudesRobin/iaas-collaboratif/metrics)

**Authors :** 
Alan DAMOTTE, Robin EUDES, Romain BARTHELEMY, Malek MAMMAR, Kai GUO, BONNARD Loïc, CAPERAN Théo

----------

> The objective of this project is to allow a user group (member) to pool their laptops or desktop in order to calculate big data of few users. To do so, the solution should work with Docker to virtualize user machines and control the use of resources of each machine.

----------

System architecture
-------------------

### Instances allocation
![img](http://air.imag.fr/images/5/59/Infrastructure_globale.png)

### SSH connections to allocated instances
![img](http://air.imag.fr/images/thumb/a/a8/Infra_generale_network.png/1000px-Infra_generale_network.png)
![img](http://air.imag.fr/images/5/58/Legend_infra.png)


Descriptions of branches
----------

**[Docker branch](https://github.com/EudesRobin/iaas-collaboratif/tree/docker):**
 Provider side

**[FrontendWebui branch](https://github.com/EudesRobin/iaas-collaboratif/tree/frontendWebui):**
 Frontend side

**[rabbitmq branch](https://github.com/EudesRobin/iaas-collaboratif/tree/rabbitmq):**
 RabbitMQ will be used to monitore provider status (and users instances running)

Links
-------
[Documentation](http://air.imag.fr/index.php/Projets-2015-2016-IaaS_Docker)

[Kanban - Waffle](https://waffle.io/EudesRobin/iaas-collaboratif)

License
-------
[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.fr.html)



