Smart Agriculture

Install MongoDB if not installed.
https://youtu.be/f70uZbQPdxo?si=V9Pp3VbE8hokE0ih  Reference video

Install NodeJS if not installed. 
https://youtu.be/mIW_8dMQaUk?si=kGhtXujA0CnC3Xt3 Reference video

Installing VSCode
https://youtu.be/TeZdo8mx0gc?si=x3246VFfqOx983ms Reference video

All the code related to the database is available in /src/app.js. Every Computation (data in and out) code is written in this file. It is not according to the MVC architecture.

The database models are present in /src/models. registers.js is the DB schema of registration. products.js is the DB schema of the registered products. orders.js is the DB schema of the orders.

There are no HTML files but handlebars. Handlebars won't run in the LiveServer extension.

The authentication code is present in /src/middleware/auth.js. The reset of Authentication is present in /src/middleware/resetAuth.js

Handlebars are present in /templates/views
Navbar is present in /templates/partials

In .env file there is a mail "sharathchandrasharath00007@gmail.com". This is just a temporary email used to send reset links to the users. We will be changing it. Please don't overuse the forgot password feature.


DB connection code is present in /src/db/conn.js

After connecting to the DB you can view the data in the DB by connecting to MongoDB compass.
I will be putting some images of the DB in the DBImages folder.



1.Open the terminal of VS Code
2.Type npm install and run the command in terminal. All the dependencies will be installed.
3.Type npm run dev to run the website in development. You should see the message "The server is running on port:3000. Connection to DB successful"
4.Perform the operations

Enjoy!