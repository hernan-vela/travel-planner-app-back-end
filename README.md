# Diploma of Web Development at CoderAcademy - Cohort October 2024

## Assignment - Construct a Back-end Web Application

### 16020 - Tsai-Chi Yang
### 15524 - Hernan Velasquez
### 16011 - Jessica Amy

### Style Guide for the code

The code of the Travel Planner Web Application is written following the **Airbnb JavaScript Style Guide**(Airbnb, 2025)[^1], to facilitate readability, safe JavaScript practices, and seamless interaction among coders that might want to inspect this source in the future.

### Dependent software and packages

To support the core functionality and enhance development efficiency, the app relies on the following key software dependencies and packages:

#### Mongoose
Object Data Modelling (ODM) library to work with MongoDB and Node.js. It works as a link between the MongoDB database and Node.js, allowing the creation of models to interact with the database through JavaScript objects (Automattic, 2025)[^2].
#### Express.Js
A backend framework that facilitates routing using HTTP requests and provides middleware functions to sustain the request-response cycle. Express.js uses functions that can modify requests and response objects, terminate the request-response cycle, and call the next function in the stack (MDN web docs, 2025)[^3].
#### JSON Web Token
This is a Node.js library that uses the JSON Web Token (JWT), a method to create, verify and decode information shared between two parties. It allows for a secure route, avoiding unwanted entities from accessing the user's information (Geeks for Geeks, 2025)[^4].
#### Bcrypt
Package with a password-hashing function that masks a user's password in a random sequence of letters and numbers. This is a one-way hashing function, which means it is computationally infeasible to reverse the hash back to the original password (Auth0, 2021)[^5].
#### Dotenv
Node.js package that enables the management of environment variables by loading them from a ```.env``` file. This practice avoids coders storing sensitive data in the codebase. This package allows different configurations for development, testing, and production environments (TeachmeJS, 2025)[^6].
#### Jest
Testing framework developed by Facebook, which is mainly used for testing React applications, but it is robust enough to be used with any JavaScript project. It is quite comprehensive while allows testing solutions with minimal setup, mocking functions and modules and code coverage reporting (jestjs, 2025)[^7].


### Minimal hardware required

According to the dependencies and packages used in this application, the minimal requirements are:
- CPU: with Dual-core processor (e.g., Intel i3 or equivalent ARM)
- RAM: 4 GB
- Storage: 10 GB available
- OS: Windows 10+, macOS, or Linux
### Sources

1. **Node.js System Requirements**:  
    https://nodejs.org/en/download
    
2. **MongoDB System Requirements (Mongoose uses MongoDB)**:  
    [https://www.mongodb.com/docs/manual/administration/production-notes/](https://www.mongodb.com/docs/manual/administration/production-notes/)
    
3. **DigitalOcean & Heroku minimum specs** for small apps:  
    https://www.digitalocean.com/products/droplets  
    https://devcenter.heroku.com/articles/nodejs-support


### References

[^1]: Airbnb, JavaScript 2025, *Airbnb JavaScript Style Guide*, accessed on 10 May 2025, https://github.com/airbnb/javascript

[^2]:  Automattic, Github, 2025, *Mongoose*, accessed on 25 May 2025, https://github.com/Automattic/mongoose?tab=readme-ov-file

[^3]: MDN Web Docs, 2025, *Express/Noode introduction*, accessed on 10 May 2025, https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction

[^4]: Geeks for Geeks, 2025, *How to use JSON web tokens with Node.js?*, accessed on 10 May 2025, https://www.geeksforgeeks.org/how-to-use-json-web-tokens-with-node-js/

[^5]: Auth0, 2021, *Hashing in Action: Understanding bcrypt*, accessed on 10 May 2025,  https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

[^6]: TeachmeJs, 2025, *Understanding dotenv: A Guide to Managing Environment Variables in Node.js*, accessed on 15 May 2025, https://teachmejs.com/understanding-dotenv-a-guide-to-managing-environment-variables-in-node-js/

[^7]: Jest on Github, 2025, *Delightful JavaScript Testing*, accessed on 5 May 2025, https://github.com/jestjs/jest