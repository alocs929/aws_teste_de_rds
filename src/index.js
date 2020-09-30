const express = require("express");
const connection = require("./db/connection");
const app = express();

app.use(express.json());


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

function removeLogin(email, password) {
  connection.connect(function (err) {
    if (err) {
      console.error(`Database connection failed:${err.stack}`);
      return console.log("erro na conexão");
    }
  });


  connection.query(`DELETE FROM todolist.login WHERE email = '${email}';`, function (err, result) {
    if (err) {
      return console.error("Erro ao remover login");
    }
    console.log("login removido!");
  })
}

function findLoginWithEmail(email) {

  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM todolist.login WHERE email = '${email}';`, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result[0]);
    })
  })
}

// ------ FUNÇÕES DE TODO

function addTodo(idLogin, title) {
  let stringSQL = `INSERT INTO todolist.list (idLogin, title) VALUES ('${idLogin}','${title}');`;

  connection.query(stringSQL, function (err, result) {
    if (err) {
      return console.error("Erro ao adicionar todo");
    }
    console.log("todo inserido!");

  })
}

function removeTodo(idTodo) {
  connection.query(`DELETE FROM todolist.list WHERE id = '${idTodo}';`, function (err, result) {
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

function updateTodo(title) {
  // connection.connect(function (err) {
  //   if (err) {
  //     console.error(`Database connection failed:${err.stack}`);
  //     return console.log("erro na conexão");
  //   }
  // });

  connection.query(`SELECT * FROM todolist.list WHERE title = '${title}';`, function (err, result) {
    if (err) {
      console.log("erro no select do todo")
      reject(err)
    }

    if(result[0].status===0){
      connection.query(`UPDATE todolist.list SET status='1' WHERE title='${title}';`, function (err, result1) {
        if (err) {
          return console.error("Erro ao atualizar todo");
        }
        console.log("todo atualizado!");
        
      })
    }else{
      connection.query(`UPDATE todolist.list SET status='0' WHERE title='${title}';`, function (err, result1) {
        if (err) {
          return console.error("Erro ao atualizar todo");
        }
        console.log("todo atualizado!");
      })
    }
  })

  
}

function findTodoWithTitle(title) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM todolist.list WHERE title = '${title}';`, function (err, result) {
      if (err) {
        console.log("erro no select do todo")
        reject(err)
      }
      resolve(result[0]);
    })
  });
}

function findAllTodos() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM todolist.list;`, function (err, result) {
      if (err) {
        console.log("erro no select do todo")
        reject(err)
      }

      resolve(result);
    })
  });
}


// createDB();



app.post('/login', (request, response)=>{
  const { email , password} = request.body;
  addLogin(email, password);
  return response.json({ message: "Cadastrado com sucesso!"});
});

app.delete('/login', (request, response) => {
  const { email, password } = request.body;
  findLoginWithEmail(email).then(login=>{
    if (login.password === password) {
      removeLogin(email);
      return response.json({ message: "Cadastrado removido com sucesso!" });
    }
    return response.json({ message: "Senha/Email incorreta!" })
  });
});

app.post('/list', (request, response)=>{
  const { email, password, title} = request.body;
  findLoginWithEmail(email).then(login=>{
    if (login.password === password) {
      addTodo(login.id, title);
      return response.json({
        message: "Item adicionado a lista",
        email: email,
        title: title,
        status: 0
      });
    }
    return response.json({ message: "Senha/Email incorreta!" })
  });
});

app.delete('/list', (request, response)=>{
  const { email, password, title} = request.body;
  
  findLoginWithEmail(email).then(login=>{
    if (login.password != password) {
      return response.json({ message: "Senha/Email incorreta!" })
    }
  });

  findTodoWithTitle(title).then(todo=>{
    removeTodo(todo.id)
    return response.json({
      message: `Item ${todo.title} alterado a lista`,
    });
  });
  
});

app.put('/alterStatus', (request, response)=>{
  const { email, password, title} = request.body;
  
  findLoginWithEmail(email).then(login=>{
    if (login.password != password) {
      return response.json({ message: "Senha/Email incorreta!" })
    }
  });
  
  updateTodo(title);

  findTodoWithTitle(title).then(todo=>{
    return response.json({
      message: `Status do item ${todo.title} atualizado!`
    });
  });
  
});



app.get('/list', (request, response)=>{
  findAllTodos().then(items=>{
    const array = [];
    items.map(i => {
      array.push({id: i.id, idLogin: i.idLogin, title: i.title, status: i.status})
    })
    return response.json(array);
  });  
});



app.listen(9999, () => {
  return console.log("Servidor no ar!");
});