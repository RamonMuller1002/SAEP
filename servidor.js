import express from "express";
import session from "express-session";
import cors from "cors";
import pool from "./conexao.js";
import path from "path";

import { fileURLToPath } from "url";
import e from "express";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: "chave-secreta",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Pasta pública (acesso livre)
app.use("/publico", express.static(path.join(__dirname, "publico")));

function verificarLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    // Se não estiver logado, redireciona para a página de login
    res.redirect("/publico/index.html");
  }
}

app.use(

  "/privado",
  verificarLogin,
  express.static(path.join(__dirname, "privado"))
);

// Definir a Página inicial
app.get("/", (req, res) => {

  //if (req.session.logado) {
  //  res.redirect("/privado/area.html");
  //} else {
  res.redirect("/publico/index.html");
});

// Endpoint de logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/publico/index.html");
  });
});

app.post("/cadastro", (req, res) => {
  const { nome, cpf, senha, telefone, endereco } = req.body;
  pool.query("INSERT INTO tutor (nome, cpf, senha, telefone, endereco) VALUES ($1, $2, $3, $4, $5)", [ nome, cpf, senha, telefone, endereco ],
    (error, results) => {
      if (error) { return res.status(500).json(error); }
      else { return res.status(200).json({ msg: "Usuário cadastrado com sucesso!" }); }
    })
});

//Endpoints do login
app.post("/login", (req, res) => {
  const { cpf, senha } = req.body;
  pool.query(
    "SELECT * FROM tutor WHERE cpf=$1 AND senha=$2", [cpf, senha],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Erro ao consultar o banco de dados" });
      }
      if (results.rows.length > 0) {
        req.session.logado = true;
        res.redirect("/privado/area.html");
      } else {
        res.redirect("/publico/index.html?erro=1");
      }
    }
  );
});

app.delete("/deleteAnimal", (req, res) => {
  const { id } = req.body;
  pool.query("DELETE FROM pet WHERE id=$1", [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Erro ao deletar o animal" });
    }
    return res.status(200).json({ msg: "Animal deletado com sucesso!" });
  });
})


// Consultar a tabela de animais
app.post('/cadastroAnimal',verificarLogin, (req, res) => {
  const {nome, especie, idade, id_tutor} = req.body;
  pool.query(
    "INSERT INTO pet (nome, especie, idade, id_tutor) VALUES ($1, $2, $3, $4)", 
    [nome, especie, idade, id_tutor], 
    (error, resultado) => {
      if (error) {
        return res
          .status(500)
          .json({"ms": error});
      }
      else { return res.status(200).json({ msg: "Animal cadastrado com sucesso!" }); 
    }
    })
     
     
     
})

app.get('/animais', verificarLogin, (req, res) => {
  pool.query("SELECT * FROM pet", (erro, resultado) => {
    if (erro) { return res.json({ "msg": "Falha ao consultar os animais" }) }
    return res.json(resultado.rows)
  })
})







app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
