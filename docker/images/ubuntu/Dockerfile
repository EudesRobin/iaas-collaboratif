FROM ubuntu:latest

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:iaas' | chpasswd
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ADD ./frontend.pub ./

RUN mkdir ~/.ssh/
RUN touch ~/.ssh/autorized_keys
RUN chmod 600 ~/.ssh/autorized_keys
RUN cat ./frontend.pub >> ~/.ssh/autorized_keys

RUN ssh-keygen -y -P "" -t dsa -f /etc/ssh/ssh_host_dsa_key

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]