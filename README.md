# MovieDB	
[moviedb.leoirus.in](https://moviedb.leoirus.in)

**MovieDB** is a responsive and intuitive Web Application to find the favourite movies and its details. Built as a mobile-first layout and also has other layouts for Tablets, Desktops and Extra Large screens.

### Build Stack 

NodeJS, ExpressJS, Mongoose.js, MongoDB, Bootstrap, jQuery, JavaScript, HTML, CSS, AWS EC2

* MovieDB uses **Bootstrap4** for a mobile-first layout, with jQuery for easy page manipulation. 
* On the backend an **Express/Node.js** app lives on AWS Cloud EC2 with web server NGINX .
* **MongoDB** created as **ReplicaSets** in 3 different Private EC2s with no access to the internet on AWS for High Data Availability and Security interacts with the app using Mongoose.js and returns the information to the user. 	
* Private EC2s connects only with one EC2 where the app lives which has access to the public internet. 

![MovieDB](public/assets/moviedb.gif)
