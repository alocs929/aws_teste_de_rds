const { request, response } = require("express");
const express = require("express");
const fs = require("fs");
const { addListener } = require("process");
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

  connection.query(`DROP DATABASE IF EXISTS todolist;`, function (err, result) {
    if (err) {
      console.error('erro ao apagar list: ' + err.stack);
      return;
    }
    console.log("drop database");
    // console.log(result);
  }).end();
}

function createDB (){

  connection.query("CREATE DATABASE IF NOT EXISTS `todolist` DEFAULT CHARACTER SET utf8", "USE `todolist`;", function (err, result) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return console.log("erro na criação do db");
    }
    console.log("database created!");
  });

  connection.query("CREATE TABLE IF NOT EXISTS `todolist`.`login` (`id` INTEGER AUTO_INCREMENT, `email` VARCHAR(45) NOT NULL, `password` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE, UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE) ENGINE = InnoDB;", function (err, result) {
      if (err) {
        console.error('Database connection failed: ' + err.stack);
        return console.log("erro na criação da tabela");
      }
      console.log("tabela login created!");
  });

  connection.query("CREATE TABLE IF NOT EXISTS `todolist`.`list` ( `id` INT AUTO_INCREMENT,  `idLogin` INT NOT NULL, `title` VARCHAR(45) NOT NULL, `status` INT NOT NULL DEFAULT 0, PRIMARY KEY (`id`, `idLogin`), INDEX `fk_table1_1_idx` (`idLogin` ASC) VISIBLE, UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE, CONSTRAINT `fk_table1_1` FOREIGN KEY (`idLogin`) REFERENCES `todolist`.`login` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE = InnoDB;", function (err, result) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return console.log("erro na criação da tabela");
    }
    console.log("tabela list created!");
  });

  connection.end();
}

function addLogin (email, password){

  connection.connect(function(err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  // await connection.query(`INSERT INTO login (email, password) VALUES ('${email}', '${password}');`, function (err, result) {
    connection.query("INSERT INTO todolist.login (email, password) VALUES('user2', 'senha');", function (err, result) {
    if (err) {
      console.error('Database insertion in login is failed: ' + err.stack);
      return console.log("erro ao inserir login");
    }
    console.log("inseriu em login");
  });
}

function findPassWithLogin (email){
 
  // connection.query(`SELECT email FROM login WHERE email='${email}';`, function (err, result) {
  const teste = connection.query("SELECT * FROM todolist.login; ", function (err, result) {
    if (err) {
      console.error('Database insertion in login is failed: ' + err.stack);
      return;
    }
    console.log("buscou login");
    console.log(result);
  });

  // console.log(teste);

}

// reestartTables();
createDB();
// addLogin('bruno','brunobruno');
// findPassWithLogin('user');



//##########################################

app.get('/teste', (request, response)=>{
  return response.json({ok:true});
});



// app.get('/login', (request, response)=>{
//   //array  
//   const logins = findAllLoigns();  
//   return response.json([{id, email, password}...]);
// })



// app.post('/login', (request, response)=>{
//   const { email , password} = request.body;
//   addLogin(email, password);
//   return response.json({ message: "Cadastrado com sucesso!"});
// });



// app.delete('/login', (request, response)=>{
//   const { email , password} = request.body;
//     const passwordCheck = findPassWithLogin(email);
//     if (passwordCheck === password){
//       // removeLogin(email);
//       return response.json({ message: "Cadastrado removido com sucesso!"});
//     }
//     return response.json({message: "Senha incorreta!"})
// });



// app.post('/list', (request, response)=>{
//   const { email, title} = request.body;
//   //verifica se email existe e retorna o id dele no banco
//   const idLogged = verifyEmail(email);
//   if (idLogged){
//     // status no banco ta default 0, 0 nao feito,1 feito, addList cadastra
//     addList(idLogged, title);
//     return response.json({
//       message: "Item adicionado a lista",
//       email: email,
//       title: title,
//       status: 0
//     });
//   }
//   return response.json({message: "Email inexistente!"});
// });



// app.delete('/list', (request, response)=>{
//   const { email, title} = request.body;
//   //verifica se email existe e retorna o id dele no banco
//   const idLogged = verifyEmail(email);
//   if (idLogged){
//     // status no banco ta default 0, 0 nao feito,1 feito, addList cadastra
//     addList(idLogged, title);
//     return response.json({
//       message: "Item adicionado a lista",
//       email: email,
//       title: title,
//       status: 0
//     });
//   }
//   return response.json({message: "Email inexistente!"});
// });



// app.delete('/list', (request, response)=>{
//   const { email , password, title} = request.body;
//     const passwordCheck = findPassWithLogin(email);
//     if (passwordCheck === password){
//       const item = findListWithTitle(title);
//       removeList(item.id);
//       return response.json({ message: "Item removido com sucesso!" });
//     }
//     return response.json({message: "Senha incorreta!"})
// });



// app.put('/alterStatus', (request, response)=>{
//   const { email , password, title} = request.body;
//     const passwordCheck = findPassWithLogin(email);
//     if (passwordCheck === password){
//       const item = findListWithTitle(title);
//       const newStatus = alterStatus(item.id);// status = !status // 1 ? 0 : 1
//       return response.json({
//         message: "Item alterado na lista",
//         email: email,
//         title: title,
//         status: newStatus
//       });
//     }
//     return response.json({message: "Senha incorreta!"})
// });



// app.get('/list', (request, response)=>{
//   //array  
//   const logins = findAllList();  
//   return response.json([{id, email, title, status}...]);
// });



app.listen(9999, ()=>{
  return console.log("Servidor no ar!");
});