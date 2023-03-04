const jwt = require("jsonwebtoken");
const dbc = require("../config/db");


module.exports = async (req, res, next) => {
  const jwt = require("jsonwebtoken");


try{

  if(req.cookies.jwt){
      
      const { jwt: token } = req.cookies;

      //on compare le token dans le cookie avec le token_secret
      const decodedToken = jwt.verify(token, "process.env.TOKEN_SECRET");

      const { user_id: idOfUser } = decodedToken;
      console.log("auth id" , idOfUser);
      const userId = decodedToken.user_id;
      req.auth = { userId };
    

      const db = dbc.getDB();
      const sql = `SELECT id FROM users WHERE id = ${idOfUser}`;

      db.query(sql, async (err, result) => {
        if (err) res.status(204).json({ err: "erreur" });

      
         
          if(result[0].id === idOfUser){
            
            next();
          }else {
            console.log("Non autorisé");
          }
          
        
      });

  } else {
    res.clearCookie();
    res.status(401).json({ message: "Non autorisé" });
    
  }
} catch (err) {
  res.clearCookie();
  console.log(err);
  res.status(200).json({ message: "Erreur serveur" });
}
};
 

