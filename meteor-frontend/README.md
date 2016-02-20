Collaborative IaaS with Docker
==============================

[![Stories in Ready](https://badge.waffle.io/EudesRobin/iaas-collaboratif.png?label=ready&title=Ready)](https://waffle.io/EudesRobin/iaas-collaboratif)

**Authors :** 
Alan DAMOTTE, Robin EUDES, Romain BARTHELEMY, Malek MAMMAR, Kai GUO, BONNARD Loïc, CAPERAN Théo


How does it work ?
---------------
    ├── client
    ├── css
    ├── index.html
    ├── model
    ├── public
    ├── README.md
    └── server

[Files scructure in Meteor](http://docs.meteor.com/#/basic/filestructure).

Just to quote them, if you are too lazy to click on the previous link :

----------

> Special directories
>
> /client
>
Any files here are only served to the client. This is a good place to keep your HTML, CSS, and UI-related JavaScript code.
>
> /server
>
Any files in this directory are only used on the server, and are never sent to the client. Use /server to store source files with sensitive logic or data that should not be visible to the client.
>
> /public
>
Files in /public are served to the client as-is. Use this to store assets such as images. Note that /public is not part of the image URL.
>
> -- <cite> http://docs.meteor.com/#/basic/filestructure</cite>

----------

**css:**
Contains some css custom rules.

**model:**
Contains a description of the model used to store data.

Detail of client folder
-----------------------
    ├── help
    ├── homepage
    ├── lib
    ├── profile
    ├── provider
    ├── routes.js
    ├── styles
    └── user

**help:**
Folder containing the help/wiki section of our webui.

**homepage:**
Folder containing the index section of our webui.

**profile:**
Folder containing the profile section of our webui.

**provider:**
Folder containing the provider section of our webui.

**user:**
Folder containing the user section of our webui.

**styles:**
Folder containing some css rules (for the sidebar menu)

**lib:**
Folder containing app.js, the config file of our angularJS app.


Links
-------
[Documentation](http://air.imag.fr/index.php/Projets-2015-2016-IaaS_Docker)

[Kanban - Waffle](https://waffle.io/EudesRobin/iaas-collaboratif)

Licence
-------
[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.fr.html)