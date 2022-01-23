 
Assumptions made:
Format of csv to be uploaded must be the same as the one provided in the sample data in the challenge email, including the date time format
The Appointment ID goes in Hexadecimal order as couldn't decide if the order is A9 -> B1 or A9-A10 so made it hexadecimal instead since that made sense to me.
## Getting Started

Requires Node 12 ^
Use npm install to install prerequisites

Then run the following to start the server

```bash
npm run build
npm start
```

Build is used to build the production files for server env. 
If you want to start it without having to build, can modify app.js line 13 and set isDev to true. Will run the code in dev mode but will be slower.

Enter browser and type in http://localhost:8080/ to visit the challenge
