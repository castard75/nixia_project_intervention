const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbc = require("../config/db");
const db = dbc.getDB();


const maxAge = 3 * 24 * 60 * 60 * 1000;

exports.signup = async (req, res) => {
  //Recuperation du name,email et password de la requête avec la destructuration
  const { firstname, lastname, email,tel_fixe,tel_portable,adresse} = req.body;

  const salt = await bcrypt.genSalt(8);

  //Mot de passe Hashé

  const db = dbc.getDB();

  db.query(
    "SELECT email from customers where email = ?",
    [email],
    (err, results) => {
      // si results est plus grand que 0  il y a déja l'email dans la database
      if (results.length > 0) {
        return res.status(200).json({ errorMessage: "Déja enregistré" });
      } else {
        //On insert les valeurs du formulaire dans la table users
        db.query(
          "INSERT INTO customers SET ?",
          {
            first_name: firstname,
            last_name: lastname,
            email: email,
          tel_fixe :tel_fixe,
          tel_portable: tel_portable,
          adresse : adresse
           
          },
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json({
                message: "client crée!",
                result: result.insertId,
                client:lastname
              });
            }
          }
        );
      }
    }
  );
};




exports.getAllUsers = async (req, res) => {
  const sqlGetUser = `SELECT * FROM customers ;`;
  db.query(sqlGetUser, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    //on enlève le mdp du resultat
    delete result[0].user_password;
    res.status(200).json(result);
    
  });
};


exports.addIntervention = (req,res) => {


  //GESTION HEURE ET DATE

  const timestamp = (num) => {
    let options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    let date = new Date(num).toLocaleDateString("fr-FR", options);
    return date.toString();
  };


  // Date classique
let dates = new Date();

  
// IsoString
const  iso = dates.toISOString();



 const dateDestructurings = (chaine) => {
  let newDate = chaine.split("T")[0];
  
  let [y, m, d] = newDate.split("-");
  return [y, m, d].join("-");
};



  const hours = timestamp(Date.now()).split(",")[1]
  const date = dateDestructurings(iso)
  

  
const dateTab = [];
dateTab.push(req.body.intervention_date,hours)
const intervention_date = dateTab.join(",").replace(',',"")

const addHours = [];
let time = req.body.intervention_time;
addHours.push(time)

  const { id: customer_id } = req.params;
  const data = {
    user_id: customer_id,
    title : req.body.title,
    intervention_description: req.body.intervention_description,
    intervention_date: intervention_date,
    intervention_time:req.body.intervention_time ,
    signature: req.body.signature,
   
  };

  const db = dbc.getDB();

  db.query("INSERT INTO intervention SET ?", [data], (err, result) => {
    if (err) {
      res.status(200).json({ message: err });
      throw err;
    }

    // post_id will be equal to the post inserted, and will be reused to link the image at the correct post in the below query
    else {
      res.status(200).json(result);
    }
  });

  
}

exports.getInterventions= (req,res) => {
  const { id: user_id } = req.params;


db.query(`SELECT *
FROM intervention
JOIN customers ON intervention.user_id= customers.customer_id
WHERE intervention.user_id = ${user_id};`,

(err,result) => {

if(err){
  throw err
} else{

  res.status(200).json(result)
}

  
})

}

exports.getOneIntervention= (req,res) => {
  const { id} = req.params;


db.query(`SELECT *
FROM intervention
WHERE intervention_id = ${id};`,

(err,result) => {

if(err){
  throw err
} else{

  res.status(200).json(result)
}

  
})

}