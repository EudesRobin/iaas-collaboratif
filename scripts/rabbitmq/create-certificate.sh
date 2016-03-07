domain="localhost"
pass="MySecretPassword"

echo "*************************************************"
echo "** Cleaning ... *********************************"
echo "*************************************************"

mkdir coordinators
cd coordinators
rm -r $1

echo "*************************************************"
echo "** Creating a new signed certificate... *********"
echo "*************************************************"

mkdir $1
cd $1
openssl req -newkey rsa:2048 -keyout key.pem -keyform PEM -out \
    req.pem -subj /CN=$1/O=client/ -outform PEM -nodes
cd ../../testca
openssl ca -config openssl.cnf -in ../coordinators/$1/req.pem -out \
    ../coordinators/$1/cert.pem -notext -batch -extensions client_ca_extensions
cd ../coordinators/$1
openssl pkcs12 -export -out keycert.p12 -in cert.pem -inkey key.pem -passout pass:$pass

echo "*************************************************"
echo "** Zipping ... **********************************"
echo "*************************************************"
#copying our self signed autority certificate
cp ../../testca/cacert.pem .
#zipping everything together
tar cvf $1.tar *

# FOR EXTRACTING  ---> tar xvf my-file.tar