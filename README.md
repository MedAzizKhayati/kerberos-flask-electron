
#  Kerberos in Flask & Electron
<div id="top"></div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#What-is-Kerberos">What is Kerberos</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#Kerberos-Configuration">Kerberos Configuration</a></li>
        <li><a href="#Flask-Configuration">Flask Configuration</a></li>
        <li>
           <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#routes">Routes</a></li>
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#kerberos_scenario">Kerbero scenario</a></li>
      </ul>
    </li>
    <li><a href="#Acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The project

This repository contains implemented solution for **kerberos authentification** in web context. A server expose files that are protected and shouldn't be accessible unless the user is authenticated. This project is implemented on **LINUX machines** using the **Ubuntu 20.04 LTS** distribution.
<p align="right">(<a href="#top">back to top</a>)</p>

### Built With
* [Python](https://www.python.org/), the widely used interpreted language.
* [Flask](https://flask.palletsprojects.com/en/2.1.x/), micro framework open-source de développement web en Python. the python micro-framework for wen developpement.
* [Electron](https://github.com/hamza-mahjoub/flask-kerberos-module), Electron is a free and open-source software framework developed and maintained by OpenJS Foundation.
* [Vite](https://vitejs.dev/), Vite. js is **a rapid development tool for modern web projects**. It focuses on speed and performance by improving the development experience.

<p align="right">(<a href="#top">back to top</a>)</p>

### What is Kerberos
Kerberos is an AAA authentication protocol from the Massachusetts Institute of Technology (MIT) ”Athena” project. it is responsible for **authenticating, authorizing,
and monitoring users** who want to access _resources and services_ on your network thus the correspondance with the three-headed dog guardian of the gates of Hades in the greek mythology.<br>
kerberos introduces the principle of **Single Sign-On (SSO)**. Thus with a single authentication, the user will have access to all the services of the network.
it relies on a trusted third party to manage authentication, the **KDC (Key Distribution Center)**. All users and services on the network trust this third party.<br>
Kerberos uses a ticket system to perform authentication and introduces **the principle of SSO (Single Sign On)**. The user authenticates on the KDC and then uses a ticket to authenticate on each requested service. ( no password sending via network).

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

In order to run this project, we need to follow some few steps : 

### Prerequisites

* Make sure that you have a virtualization software.In this demo i used **Oracle VM VirtualBox** ( [Download Here](https://www.virtualbox.org/wiki/Downloads)).
* Make sure you have 2 linux machines with the **Ubuntu 20.04 LTS distribution**  ( [Download Here](https://ubuntu.com/download/desktop)).
* Make sure you have **python3**, **pip**, **nodejs** and **yarn** on the server machine.
```bash
  sudo apt update
  sudo apt install python3
  sudo apt install python3-pip
  sudo apt install nodejs
  npm i --global yarn
``` 


### Kerberos Configuration

#### 1. Environnement

In order to proceed with the configurations we need to have a : 
- Domain name : "insat.tn"
- Realm : "INSAT.TN"
- Two machines : 

 | Machine Name     |   Machine IP   | Sub-domain name    |
 |    :---:         |     :---:      |    :---:           |
 | KDC              | 192.168.56.110 | kdc.insat.tn     |
 | server           | 192.168.56.111 | server.insat.tn  |
 > machines IP's are just an example, use `hostname -I` to get each machine ip. <br>
 > All the configurations must be done in **root** mode, use `su -` to connect as root.
 
<p align="right">(<a href="#top">back to top</a>)</p>

#### 2. DNS (Domain name system)
Used to match domain name to their IP's.
```bash
nano /etc/hosts
```
and add _(for each machine)_ : 
```bash
192.168.56.110    kdc.insat.tn       kdc
192.168.56.111    server.insat.tn    server
```
then set the **hostname**  _(for each machine)_ :
 | Machine Name     |            set new hostname                   | 
 |    :---:         |              :---:                            |
 | KDC              | `hostnamectl set-hostname kdc.insat.tn `    |
 | server           | `hostnamectl set-hostname server.insat.tn`  |

<p align="right">(<a href="#top">back to top</a>)</p>

#### 3. Time Synchronization
When the client obtains a ticket from Kerberos, it includes in its message the current time of day. One of the three parts of the response from Kerberos is a timestamp issued by the Kerberos server.

3.1. on the **_KDC_** install **ntp**:
```bash
apt install ntp
```
then edit the `/etc/ntp.conf` and add the lines below under the `# local users may interrogate the ntp server more closely` section: 
```bash
restrict 127.0.0.1
restrict ::1
restrict 192.168.56.110 mask 255.255.255.0
nomodify notrap
server 127.127.1.0 stratum 10
listen on *
```
3.2. on the **_server_** install **ntp** and **ntpdate**:
```bash
apt install ntp
apt install ntpdate
```
then edit the `/etc/ntp.conf` and add the lines below under the `# Use Ubuntu's ntp server as a fallback` section: 
```bash
pool ntp.ubuntu.com
server 192.168.56.110
server obelix
```

3.3. Synchronize time by running the below command on the server machine:
```bash
ntpdate -dv 192.168.56.110
```
<p align="right">(<a href="#top">back to top</a>)</p>

#### 4. Configure KDC
4.1. We need to install **the packages** _krb5-kdc_, _krb5-admin-server_ and _krb5-config_ by running : 
```bash
apt install krb5-kdc krb5-admin-server krb5-config
```
During installation you will be prompted to enter the _realm_, _kerberos server_ and _administartive server_ and it would be in order:
 | Prompt                  |    value         | 
 |    :---:                |     :---:        |
 | Realm                   | INSAT.TN       |
 | Kerberos servers        | kdc.insat.tn   |
 | Administrative Service  | kdc.insat.tn   |
>Its capital sensitive.<br>
>View kdc settings with `cat /etc/krb5kdc/kdc.conf`.<br>
>The error **failed to start kerberos 5 ..** will not be a problem.

4.2 Now we need to add **kerberos database** where principals will be stored
```bash
krb5_newrealm
```
> You will be prompted to choose a password.

4.3 we will create an _admin principal_ , a _host principal_ and generate its keytab:
- **principal:** a unique identity to which Kerberos can assign tickets.
- **keytab:** stores long-term keys for one or more principals and allow server applications to accept authentications from clients, but can also be used to obtain initial credentials for client applications.
run the following commands:
```bash
kadmin.local                              # login as local admin
addprinc root/admin                       # add admin principal
addprinc -randkey host/kdc.example.tn     # add host principal
ktadd host/kdc.example.tn                 # generate host principal keytab
```
> type `q` to exit.

4.3 Grant the **admin principal** all privileges by editing `/etc/krb5kdc/kadm5.acl`:
```bash
root/admin *                              # just uncomment the line
```
4.4 restart the kerberos service by running: 
```bash
systemctl restart krb5-admin-server
systemctl status krb5-admin-server        # to check service status
```
<p align="right">(<a href="#top">back to top</a>)</p>

#### 5. Configure Server
5.1. We need to install **the packages** _krb5-user_, _libpam-krb5_ and _libpam-ccreds_ by running: 
```bash
apt install krb5-user libpam-krb5 libpam-ccreds
```
During installation you will be prompted to enter the _realm_, _kerberos server_ and _administartive server_ and it would be in order:
 | Prompt                  |    value         | 
 |    :---:                |     :---:        |
 | Realm                   | INSAT.TN       |
 | Kerberos servers        | kdc.insat.tn   |
 | Administrative Service  | kdc.insat.tn   |
>Its capital sensitive.<br>
>View krb settings with `cat /etc/krb5.conf`.

5.2 we will create a _host principal_ and generate its keytab by running:
```bash
kadmin                                       # login as admin (type your password)
addprinc -randkey host/server.example.tn     # add host principal
ktadd host/server.example.tn                 # generate host principal keytab
```
> type `q` to exit.

5.3 Add a test user and create a correspending principal by running:
```bash
useradd -m -s /bin/bash testUser
kadmin
addprinc testUser
```
> type `q` to exit.

<p align="right">(<a href="#top">back to top</a>)</p>

### Flask Configuration

We install flask nn the **server** machine by running: 
```python
pip install Flask
```
Then we need to install the **Flask_kerberos** module by running:
```python
pip install Flask-Kerberos
```
> If an error occured run `apt install libkrb5-dev` then restart the Flask_kerberos module.<br>
> If it still persists, check your gcc installation.

Then we need to install the **Flask_bootstrap** module by running:
```python
pip install flask_bootstrap
```
<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

1. Clone the repo in the server
2. Login as root by running `su -`.
3. Set the **KRB5_KTNAME** variable that references the **keytab**:
	```bash
	export KRB5_KTNAME=/etc/krb5.keytab
	```
> To visualize your keytab, run the **ktutil** as root.
> ```bash
>ktutil                  
>?                         # list all commands
>read_kt /etc/krb5.keytab  # read keytab file
>list                      # show principals
>```

4. Start the server.
	```bash
	python3 server.py
	```
5. Cd into the frontend directory & install the dependencies.
	run `yarn` in order to install node dependencies.
6. Start the application:
	`yarn dev` or `yarn build` for production environment.
	
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage
Before running the main app script you need to change hostname in each script to the one you chose:
```bash
server.py under server
index.ts under frontend/electron/index.ts
``` 
 
run the main app script by the command `./server.py` as **root** and you should see in the terminal that the server is running.
```sh
# some informations
running on http://127.0.0.1:8080
```

### Routes
The routes of the flask api.
 |       Route             |   protected      |    description                                                    | 
 |    :---                 |     :---:        |     :---                                                          |
 | /public                 |       ✖️         | return a public information                            |
 | /protected              |       ✔️         | return classified information                    

### Kerberos scenario
* We must generate a ticket so we use the command `kinit`.
> To verify the ticket we can run `klist`. It shows that it is of type **krbtgt/..** (kerberos ticket granting ticket).
* **TGT:** a user authentication token issued by the Key Distribution Center (KDC) that is used to request access tokens from the Ticket Granting Service (TGS) for specific resources/systems joined to the domain.
> To destroy the ticket we can run `kdestroy`.
* Now we try to start our frontend application and use it to communicate with the protected endpoint.
> When we run `klist`. It shows that a **TGS** is created (kerberos ticket granting service).


<p align="right">(<a href="#top">back to top</a>)</p>
## Demonstration Video

[![Demo](./Thumbnail.png)](https://github.com/MedAzizKhayati/kerberos-flask-electron/blob/master/media/demo.mp4?raw=true)

https://github.com/MedAzizKhayati/kerberos-flask-electron/blob/master/media/demo.mp4?raw=true

## Acknowledgments
A list of resources which are helpful and would like to give credit to:
* [Flask kerberos](https://flask-kerberos.readthedocs.io/en/latest/)
* [Python kerberos module](http://python-notes.curiousefficiency.org/en/latest/python_kerberos.html)
* [Electron Starter Template](https://github.com/maxstue/vite-reactts-electron-starter.git)
* [Hamza-Mahjoub-Flask-Kerberos](https://github.com/hamza-mahjoub/flask-kerberos-module)
