# Node Login Portal
A login portal created using Node.js, MongoDB, and Passport.

# Overview
The purpose of this project was to better understand user login/authentication and working with MongoDB. 
### Features
* User can register using email and password
* Passwords are hashed using bcrypt 
* After registering, users are able to login and view the success screen
* The success screen is not accessible to users not logged in and will be redirected to login screen
* Saves session to ensure users remain logged in until they logout, even after page refresh 


# Screenshots
![website-screenshot](https://i.imgur.com/KrJzR57l.png)


# Installation
1. Clone project and change into project folder
    ``` 
    $ git clone https://github.com/mhodge8/node-login-portal.git
    $ cd node-login-portal/
    ```
2. Install packages
    ```
    $ npm install
    ```
3. With MongoDB installed and in a separate shell, start database 
    ```
    $ mongod
    ```
4. Start server
    ```
    $ node app.js
    ```
5. Project will be accessible at http://localhost:3000/


# Roadmap
No plans to further update this project.


# Technologies Used
* HTML
* CSS
* Node.js
* Passport