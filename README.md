code-challenge
==============
The code is made using HTML5, AngularJs and PHP. 
THe front end code uses HTML5 Persistent storage to store the stock details
Entier UI is displayed using custom directive called stock-app. All the code for the behaiviours is in the respective directive file at app/scripts/directives/stocks.js
Directive uses link function to initialize and controller for business logic.
Backend code uses CURL to contact the server to get the data as JSONP format is not available for front end communication. Backend file is located at api/get_data.php file with minimal code. The FIle used for curl is api/curl.php which is a ready made library.

The code scaffolding is done using Yeoman tool.
CSS is in app/styles. The generated.css file is generated by generator.The file coded is kept at app/styles/stocks.css


