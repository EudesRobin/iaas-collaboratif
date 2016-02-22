domain="localhost"
pass="MySecretPassword"

# cleaning things
echo "*************************************************"
echo "** Cleaning files... ****************************"
echo "*************************************************"
rm -r client/ server/ testca/ coordinators/ rabbitmq.config
sudo service rabbitmq-server stop
mkdir coordinators

# creating the CA (Certificat Authority)
echo "*************************************************"
echo "** Creating a Certification Authority CA... *****"
echo "*************************************************"
mkdir testca
cp ./config/openssl.cnf testca
cd testca
mkdir certs private
chmod 700 private
echo 01 > serial
touch index.txt

openssl req -x509 -config openssl.cnf -newkey rsa:2048 -days 365 \
    -out cacert.pem -outform PEM -subj /CN=MyTestCA/ -nodes
openssl x509 -in cacert.pem -out cacert.cer -outform DER

# creating the server certificate
echo "*************************************************"
echo "** Creating the rabbitmq server certificate... **"
echo "*************************************************"
cd ..
mkdir server
cd server
openssl req -newkey rsa:2048 -keyout key.pem -keyform PEM -out \
    req.pem -subj /CN=$domain/O=server/ -outform PEM -nodes
cd ../testca
openssl ca -config openssl.cnf -in ../server/req.pem -out \
    ../server/cert.pem -notext -batch -extensions server_ca_extensions
cd ../server
openssl pkcs12 -export -out keycert.p12 -in cert.pem -inkey key.pem -passout pass:$pass

# creating the (front-end) certificate
echo "*************************************************"
echo "** Creating the front end certificate... ********"
echo "*************************************************"
cd ..
mkdir client
cd client
openssl req -newkey rsa:2048 -keyout key.pem -keyform PEM -out \
    req.pem -subj /CN=$(hostname)/O=client/ -outform PEM -nodes
cd ../testca
openssl ca -config openssl.cnf -in ../client/req.pem -out \
    ../client/cert.pem -notext -batch -extensions client_ca_extensions
cd ../client
openssl pkcs12 -export -out keycert.p12 -in cert.pem -inkey key.pem -passout pass:$pass

#launching rabbitmq
echo "*************************************************"
echo "** Launching RabbitMQ... ************************"
echo "*************************************************"
cd ..
# creating rabbitmq config file
config="[{rabbit, [{ssl_listeners, [5671]},{ssl_options, [{cacertfile,\"`pwd`/testca/cacert.pem\"},{certfile,\"`pwd`/server/cert.pem\"},{keyfile,\"`pwd`/server/key.pem\"},{verify,verify_peer},{fail_if_no_peer_cert,false}]}]}]."
echo $config > rabbitmq.config

sudo RABBITMQ_CONFIG_FILE=`pwd`/rabbitmq rabbitmq-server