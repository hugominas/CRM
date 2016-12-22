#!/usr/bin/env bash

# git, expect
sudo apt-get update
sudo apt-get install -y git expect build-essential

# install nginx
sudo apt-get install -y nginx
sudo cp /vagrant/default.conf /etc/nginx/sites-available/default
sudo service nginx restart

# install nvm
sudo apt-get install -y git-core curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile

# install node 6.2.2
nvm install 6.2.2
nvm alias default 6.2.2

# install mongod
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# add project to folder

echo "------ done ------"
