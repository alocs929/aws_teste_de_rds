const express = require("express");
const fs = require("fs");
const connection = require("./db/connection");
const app = express();

app.use(express.json());

function reestartTables (){
  connection.connect(function(err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  // connection.query([`USE todolist; DROP TABLE IF EXISTS login;`], function (err, result) {
  //   if (err) {
  //     console.error('erro ao apagar login: ' + err.stack);
  //     return;
  //   }
  //   console.log("drop login");
  // });

  // connection.query(`USE todolist; DROP TABLE IF EXISTS list;`, function (err, result) {
  //   if (err) {
  //     console.error('erro ao apagar list: ' + err.stack);
  //     return;
  //   }

  connection.query(`DROP DATABASE IF EXISTS todolist;`, function (err, result) {
    if (err) {
      console.error('erro ao apagar list: ' + err.stack);
      return;
    }
    console.log("drop database");
  }).end();
}

function createDB (){
  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return console.log("erro na conexão");
    }
  });

  connection.query("CREATE SCHEMA IF NOT EXISTS `todolist` DEFAULT CHARACTER SET utf8","USE `todolist`", function (err, result) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return console.log("erro na criação do db");
    }
    console.log("database created!");
  });

  connection.query("CREATE TABLE IF NOT EXISTS `todolist`.`login` (`id` INT NOT NULL AUTO_INCREMENT,`email` VARCHAR(45) NOT NULL, `password` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;", function (err, result) {
      if (err) {
        console.error('Database connection failed: ' + err.stack);
        return console.log("erro na criação da tabela");
      }
      console.log("tabela login created!");
  });

  connection.query("CREATE TABLE IF NOT EXISTS `todolist`.`list` ( `id` INT NOT NULL AUTO_INCREMENT, `idLogin` INT NOT NULL, `title` VARCHAR(45) NOT NULL, `status` INT NOT NULL DEFAULT 0, PRIMARY KEY (`id`), INDEX `fk_table1_1_idx` (`idLogin` ASC) VISIBLE, CONSTRAINT `fk_table1_1` FOREIGN KEY (`idLogin`) REFERENCES `todolist`.`login` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE = InnoDB;", function (err, result) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return console.log("erro na criação da tabela");
    }
    console.log("tabela list created!");
  });

  connection.end();
}

function addLogin (email, password){

  connection.query(`INSERT INTO login(email, password) VALUES ('${email}', '${password}');`, function (err, result) {
    if (err) {
      console.error('Database insertion in ligin is failed: ' + err.stack);
      return;
    }
    console.log("inseriu em login");
  }).end();
}

function findPassWithLogin (email){
 
  connection.query(`SELECT password FROM login WHERE email=${email};`, function (err, result) {
    if (err) {
      console.error('Database insertion in ligin is failed: ' + err.stack);
      return;
    }
    console.log("inseriu em login");
    console.log(result);
  }).end();

}

reestartTables();
// createDB();
// addLogin('bruno','brunobruno');
// findPassWithLogin('bruno');


app.get('/listarLogins', (request, response)=>{

  
  return response.json({ok:true});

});

app.listen(9999, ()=>{
  return console.log("Servidor no ar!");
});