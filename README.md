# McMakler Nasa NEO Analytics
## Analysis the Near Earth Objects data from Nasa web service and provides the details

### Setting up the application
  1. Clone the repo
  2. Install the dependencies
    ```npm install```
  2. Start mondodb server, make sure  its accessible through the uri 
    ```
    localhost:27017
    ```
  3. create database 
    ```
      nasa-neo
    ```
  4. create below user and allow access to the above database
    ```
      user: "nodejsUser",
      password: "d!45dg%4n"
    ```
 
 that's it, application is all set to work!
 
 ### Pull the last 3 years data from Nasa API
  go to the project folder and run ```npm run get-neo-feeds```
  
  
 ### Start the node server
  ```
    npm start
  ```
  Application should start and accessible at [http://localhost:3000/explorer](), swagger api documentation in place.
  Play around the apis through swagger ui
