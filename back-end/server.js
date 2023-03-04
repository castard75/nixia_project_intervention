const express = require("express")
const app = express();
let helmet = require("helmet");
const cors = require("cors");
const bodyParser = require('body-parser')
require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");


app.use(helmet());
//express json sert a lire les req.body
app.use(express.json());

app.use(cookieParser())
//CORS
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//HEADERS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
  
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });


  
  //route

  const authRoutes = require("./routes/auth.routes")

  const customersRoutes = require('./routes/customers.routes')

  app.use("/api/auth",authRoutes)
 
  app.use('/api/customers',customersRoutes)

 


 
  


//ECOUTE DU PORT
app.listen(5000, () =>{ console.log("connecté");})

