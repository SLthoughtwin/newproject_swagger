const express = require('express');
const { Server } = require('http');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('dotenv').config()
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
require('./db/connection');
const newRoute = require('./routes/route');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

const static_path = path.join(__dirname,"./views")
const static_path_img = path.join(__dirname,"./uploads")
app.use(express.static(static_path));
app.use(express.static(static_path_img))
app.set("view engine", "hbs");

const options = {
  definition:{
  openapi: '3.0.0',
  info: {
    title: "Demoapi",
    version : 1.0,
    description: "This is a simple CRUD API application made with Express and documented with Swagger",
    contact:{
      name: "sourabh",
      email: "sourabh@gmail.com"
    }
  },
  servers : [
    {
      url : "http://localhost:8080"
    }
  ]
},

apis: ['./routes/route.js']
};


const specs = swaggerJSDoc(options);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs))




app.use('/crud',newRoute);
// app.use('/',newRoute);

app.listen(8080,()=>{
    console.log('start server :');
})