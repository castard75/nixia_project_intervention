const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbc = require("../config/db");
const db = dbc.getDB();


const maxAge = 3 * 24 * 60 * 60 * 1000;

exports.signup = async (req, res) => {
  //Recuperation du name,email et password de la requête avec la destructuration
  const { firstname, lastname} = req.body;

 let  passwordgenerator = "123456789";
 let newPassword= "" ;

 function randomPassword(){
for (let i = 0;i<4; i++){

 let random = Math.floor(Math.random() *passwordgenerator.length)

 newPassword+= random
 
}

console.log(newPassword);
return newPassword


 };


//code pin
let codePin = randomPassword()

   

  
  const db = dbc.getDB();


  db.query(
    "SELECT first_name, last_name from users where last_name = ?",
    [lastname],
    (err, results) => {
     
      // si results est plus grand que 0  il y a déja l'email dans la database
      if (results.length > 0) {
        console.log(results[0].last_name);
        console.log(results[0].first_name);
        return res.status(200).json({ errorMessage: "Déja enregistré" });
      }else {

        const sql = "SELECT password FROM users"
        db.query(
          sql,
          
          (err, results) => {
            
            if (err) {
              return res.status(404).json({ err });}
              
      
      
        const passwordTab = [];
      
      results.forEach(element => {
      
       const findPass = element.password;
      
       passwordTab.push(findPass)
      
       
      });
      
      let newCode = codePin;
      
        while(passwordTab.includes(newCode)) {
      
          newCode =codePin  }
      
     
       
       db.query(
        "INSERT INTO users SET ?",
        {
          first_name: firstname,
          last_name: lastname,
          
          password: newCode,
          role: "employé",
         
        },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(201).json({
              message: "Utilisateur crée!",
              result: result,
              codePin:codePin,
              last_name: lastname,
              firstname : firstname
              
            });
          }
        }
      );
                
          }
        );
        
      }
    
    
    
    })



};

exports.login = async (req,res) =>{

  const db = dbc.getDB();
  const {password} = req.body;





db.query(  `SELECT id, first_name, last_name, password,role  FROM users WHERE password =?`,[password], 

async (err,result) => {

  if (err) return res.status(404).json({ err });
  console.log(result);

  if(result.length===0){

  return   res.status(200)
  .json({ errorMail: "Utilisateur inconnue" });
  }

  else {
    const hashedPassword = result[0].password;
   

if (hashedPassword !== password) {
  return res
    .status(200)
    .json({ errorPassword: "Mot de passe inconnue" });
} else {
  delete result[0].password;
  const user_id  = result[0].id;
  console.log({id: user_id});
  const token = jwt.sign({ user_id }, "process.env.TOKEN_SECRET", {
    expiresIn: maxAge,
  });

  res.cookie("jwt", token, {
    sameSite: "none",
    secure: true,
  });
  
  res.status(200).json({
    user: result[0],
    token: jwt.sign({ user_id:user_id}, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    }),
  });



}

    // return res.status(200).json(result)
  }


}
  )

 }




