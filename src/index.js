const { request, response } = require("express");
const express = require("express");
const fs = require("fs");
const { addListener } = require("process");
const connection = require("./db/connection");
const app = express();

app.use(express.json());

function reestartTables() {

  connection.connect(function (err) {
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

function createDB() {

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

function addLogin(email, password) {

  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  connection.query(`INSERT INTO todolist.login (email, password) VALUES ('${email}', '${password}');`, function (err, result) {
    // connection.query("INSERT INTO todolist.login (email, password) VALUES('user2', 'senha');", function (err, result) {
    if (err) {
      console.error('Database insertion in login is failed: ' + err.stack);
      return console.log("erro ao inserir login");
    }
    console.log("inseriu em login");
  });
}

async function removeLogin(email, password) {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });




  await connection.query(`DELETE FROM todolist.login WHERE id = '${result[0].id}';`, function (err, result) {
    if (err) {
      return console.error("Erro ao remover login");
    }
    console.log("login removido!");
  })




}

function listLogin() {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  connection.query("SELECT * FROM todolist.login ;", function (err, result) {
    if (err) {
      return console.error("Erro ao logins não encontrados");
    }
    console.log(result);
  })
}

function updateLogin(id, email, senha) {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  connection.query("UPDATE todolist.login SET email='novoEmail', senha='novaSenha' WHERE id=2 ;", function (err, result) {
    if (err) {
      return console.error("Erro ao atualizar login");
    }
    console.log("login atualizado!");
    console.log(result);
  })
}

async function findIdWithLogin(email) {
  await connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }

  });
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM todolist.login WHERE email = '${email}';`, function (err, result) {
      if (err) {
        reject(err)
        // callback(err, null);
      }

      // console.log(result[0].id);
      resolve(result[0].id)
      // console.log(result);
      // return result[0].id;
    })
  })
}


// ------ FUNÇÕES DE TODO

function addTodo(idLogin, title, status) {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });
  let stringSQL =
    "INSERT INTO todolist.list (idLogin, title, status) VALUES (" + idLogin + "," + title + "," + status + ");";
  //connection.query(`INSERT INTO todolist.list (idLogin, title, status) VALUES (${idLogin},${title},${status});`, function(err, result){
  connection.query(stringSQL, function (err, result) {
    if (err) {
      return console.error("Erro ao adicionar todo");
    }
    console.log("todo inserido!");

  })
}

function removeTodo(idTodo) {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  connection.query("DELETE FROM todolist.list WHERE id = 1;", function (err, result) {
    if (err) {
      return console.error("Erro ao remover todo");
    }
    console.log("todo removido!");

  })
}

function listTodo() {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  connection.query("SELECT * FROM todolist.list ;", function (err, result) {
    if (err) {
      return console.error("Erro ao remover todo");
    }
    console.log("todo removido!");
    console.log(result);
  })
}

function updateTodo(id, title, status) {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });

  connection.query("UPDATE todolist.list SET title='atualizar', status=3 WHERE id=2 ;", function (err, result) {
    if (err) {
      return console.error("Erro ao atualizar todo");
    }
    console.log("todo atualizado!");
    console.log(result);
  })
}

// reestartTables();
// createDB();
// addLogin('jorder','redroj');
// removeLogin('user2', 'senha');



var id;

findIdWithLogin('user2').then(id => console.log("I am id:" + id));


console.log(`#### ${id}`)

// addTodo(1, "non", 2);
// removeTodo(1);
// listTodo();
// updateTodo(2, 'atualizar', 8);

//##########################################

app.get('/teste', (request, response) => {
  return response.json({ ok: true });
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



app.delete('/login', (request, response) => {
  const { email, password } = request.body;
  const passwordCheck = findPassWithLogin(email);
  if (passwordCheck === password) {
    removeLogin(email);
    return response.json({ message: "Cadastrado removido com sucesso!" });
  }
  return response.json({ message: "Senha incorreta!" })
});





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



app.listen(9999, () => {
  return console.log("Servidor no ar!");
});