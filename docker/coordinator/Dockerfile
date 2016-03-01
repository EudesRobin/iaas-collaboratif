FROM debian:latest

RUN apt-get update && apt-get install -y openssh-server
RUN apt-get install -y sshpass curl
RUN mkdir /var/run/sshd

#Install node
# install our dependencies and nodejs
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash
RUN apt-get install -y nodejs build-essential

ADD ./publisher ./publisher/
RUN cd ./publisher/ && npm install

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

RUN ssh-keygen -q -N "" -t rsa -f ~/.ssh/id_rsa

ADD ./frontend.pub ./

RUN adduser --disabled-password --gecos "" iaas-admin

RUN mkdir /home/iaas-admin/.ssh/ && \
    touch /home/iaas-admin/.ssh/authorized_keys && \
    chown iaas-admin:iaas-admin /home/iaas-admin/.ssh && \
    chmod -R 700 /home/iaas-admin/.ssh/ && \
    chmod 600 /home/iaas-admin/.ssh/authorized_keys && \
    chown iaas-admin:iaas-admin /home/iaas-admin/.ssh/authorized_keys && \
    cp ./frontend.pub /home/iaas-admin/.ssh/authorized_keys

ADD ./copyKey.sh ./
ADD ./dividePublicKey.sh ./
ADD ./deletePublicKey.sh ./
ADD ./sendInformationAboutContainers.sh ./

RUN ./copyKey.sh

RUN adduser --disabled-password --gecos "" iaas-client && \
    mkdir /home/iaas-client/.ssh/ && \
    touch home/iaas-client/.ssh/authorized_keys && \
    chown iaas-client:iaas-client /home/iaas-admin/.ssh && \
    chmod -R 700 /home/iaas-client/.ssh/ && \
    chmod 600 home/iaas-client/.ssh/authorized_keys && \
    chown iaas-client:iaas-client /home/iaas-client/.ssh/authorized_keys

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

RUN touch ./publisher/instances.data

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]



