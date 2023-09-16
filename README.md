
# Wearmeout - An e-commerce web

Wearmeout is a visionary e-commerce project I developed to simplify online fashion shopping for my non-tech-savvy friend. With a commitment to showcasing the latest trends and delivering a user-friendly shopping experience, Wearmeout is her go-to destination for all things fashion.






## Preview

### Live website
https://jazzy-clafoutis-ca122c.netlify.app

### Video
https://drive.google.com/file/d/1rSILt2XCLc8fm-43hfLsLMYoBtN1E9SU/view?usp=drive_link

### Photos

Home page

![home-page-1](https://github.com/LamNgo1911/wearmeout/assets/121915847/ddfe96bd-88ab-4b73-919a-2ef6f2d460cf)


![home-page-2](https://github.com/LamNgo1911/wearmeout/assets/121915847/962f9487-5671-4ca1-953f-d3eb976fdf2a)









## Tech Stack

**Client:** 
- React
- Redux 
- TailwindCSS
- Stripe

**Server:** 
- Node
- Express
- Mongoose
- Jwt
- Otp-generator
- Nodemailer


## Installation

Install my-project with npm


```
1. Create a new MongoDB cluster
2. Create a shared cluster
3. Choose "Connect" on the newly created cluster
4. Choose Node.js and version 4.1 or later
Copy the connection string and replace "username" and "password" with the credentials of the cluster
```

Clone project from GitHub

```
git clone https://github.com/LamNgo1911/wearmeout.git
<!-- server -->
cd server
npm install
<!-- client -->
cd client
npm install
```

Create a .env file based on the .env.example file

```
# .env
...
MONGO_URI = mongodb+srv://<username>:<password>@nodeexpressprojects.wgrsvqi.mongodb.net/Project-2?retryWrites=true&w=majority
JWT_SECRET = c992742e1c15449bac6c7585438facf9
JWT_EXPIRE = 30d
<!-- Change MONGODB_URI, JWT_SECRET and JWT_EXPIRE value to your customized connection string, JWT_SECRET and JWT_EXPIRE -->
```


## Run locally

Server-side

```
    cd server
    npm start
```
Client-side

```
    cd client
    npm start
```

Enjoy the application!
