Basic Docker image for running Nagios.<br />
This is running Nagios 3.5.1 on Ubuntu distrib.

You should either link a mail container in as "mail" or set MAIL_SERVER, otherwise
mail will not work.

### Knobs ###
- NAGIOSADMIN_USER=nagiosadmin
- NAGIOSAMDIN_PASS=nagios

### Web UI ###
The Nagios Web UI is available on port 80 of the container<br />
