# SchoolControl
[![GitHub version](https://badge.fury.io/gh/tmunzer%2FSchoolControl.svg)](https://badge.fury.io/gh/tmunzer%2FSchoolControl)

![SchoolControl](http://imgur.com/V4k9M7k.png)


#Notice
This is a Free web app build to work with Aerohive APIs. This app is designed to provide a quick and easy way for teachers to enable or disable Wi-Fi on Aerohive Devices.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

#Installation
##First Run
To run this App, you need NodeJS and NodeJS packages:

1. Download and Install [NodeJS](https://nodejs.org/en/)
2. From the project root folder, run 
    npm install
3. Configure the app with your [Aerohive Developer information](https://developer.aerohive.com/):
    - Copy/Paste the file `/bin/ah_api/config_example` to `/bin/ah_api/config`
    - Edit the file `/bin/ah_api/config` to match your developer credentials

    By default (if you are not changing the server listening port), the redirectUrl should be     `https://127.0.0.1:3443/conf/api/reg`
4. Once done, you can start the APP. Go to `root_folder/bin/`and execute "www". If `node`is not in your $PATH, you may have to start the server from a terminal: `path_to_node/node ./bin/www`


##First Login
The default credentials are:

- login: admin
- password: aerohive

##Initial Configuration
Once you are logged in for the first time, you still need a few steps:

- Go to the Configuration Page ![ConfigurationPage](http://i.imgur.com/weyxtOc.png)
    - Go to "School Management"
        - Click "New School" to create a new School. You'll be able to select the access method (used by SchoolControl to control Aerohive Access Points). **Currently, only SSH is available**, the API access method will be available as soon as Aerohive Control APIs are available. 
    - Go to "API Configuration"
        - Click "Register APP": this will allow SchoolControl to get the needed credentials to request Aerohive HiveManager NG API
        - On the "API Configuration" page, under the "School" column, click on "None" to assign the new API parameters to one of the configured School
    - Go to "Classrooms Management"
        - Click "New Classroom" to create a new classroom and assign a device. A classroom can have only one device, but a device can be assigned to several classrooms.

#Menus
- ![ClassroomPage](http://i.imgur.com/PAQIdIT.png) **Classroom Page**:
    - This page will list all the classrooms configured for a school, and the status of the assigned device. 
    - From this page, a user can enable/disable the Wi-Fi for a classroom, or access to all the schedules for this classroom.
    - All the users (admin, operator and teacher) can access to this page
- ![LessonPage](http://i.imgur.com/7W2MSrr.png) **Lesson Page**:
    - This page will list all the lessons/schedules for a school or for a classroom. 
    - From this page, a user can enable/disable the Wi-Fi for a classroom, or schedule an activation.
    - All the users (admin, operator and teacher) can access to this page
- ![DevicePage](http://i.imgur.com/YWBClPv.png) **Devices Page**:
    - This page will list all the devices connected to HiveManager NG. All the information are retrieved through Aerohive APIs.
    - This page is only accessible for admin and operators
- ![ConfigurationPage](http://i.imgur.com/weyxtOc.png) **Configuration Page**:
    - This page will give access to SchoolControl configuration:
        - Users management
        - Classrooms management
        - Schools management
        - API configuration
    - This page is only accessible for admin and operators
