FROM debian:latest

RUN apt-get update && apt-get install -y openssh-server
RUN apt-get install -y sshpass
RUN mkdir /var/run/sshd

#RUN echo 'root:iaas' | chpasswd
#RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

#RUN ssh-keygen -y -P "" -t dsa -f /etc/ssh/ssh_coordinator_dsa_key

RUN ssh-keygen -q -N "" -t rsa -f ~/.ssh/id_rsa

ADD ./frontend.pub ./

RUN touch ~/.ssh/authorized_keys
RUN chmod 600 ~/.ssh/authorized_keys
RUN cp ./frontend.pub ~/.ssh/authorized_keys

ADD ./copyKey.sh ./
ADD ./dividePublicKey.sh ./
ADD ./deletePublicKey.sh ./

RUN ./copyKey.sh

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]



