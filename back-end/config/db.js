const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nixia",
  });
  

  db.connect((err, connection) => {
    if (err) {
      console.error("error connecting: " + err.stack);
    } else {
      console.log("Connection base de données ");
    }
  });

  module.exports.getDB = () => {
    return db;
  };
  