const express = require('express');
const app = express();
app.use(express.static('public'));
const PORT = 3000;
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('lojinha', 'aluno', 'ifpe2023', {
    host: 'localhost',
    dialect: 'mysql'
})
sequelize.authenticate().then(function () {
    console.log("Conectado!!")
}).catch(function (erro) {
    console.log("Erro ao conectar: " + erro)
})

app.post('/', urlencodedParser, (req, res) => {
    res.send('Bem vindo ao PetShop!')
});

const cadastro = sequelize.define('cadastro', {
    tutor: {
        type: Sequelize.STRING
    },
    endereco: {
        type: Sequelize.STRING
    },
    nomePet: {
        type: Sequelize.STRING
    },
    raca: {
        type: Sequelize.STRING
    },
    sexo: {
        type: Sequelize.STRING
    },
    contato: {
        type: Sequelize.STRING
    }
},
    {
        timestamps: false
    }
)
cadastro.sync()
app.post('/cadastro', urlencodedParser, (req, res) => {

    var tutor = req.body.tutor;
    var endereco = req.body.endereco;
    var nomePet = req.body.nomePet;
    var raca = req.body.raca;
    var sexo = req.body.sexo;
    var contato = req.body.contato;

    cadastro.create({
        tutor,
        endereco,
        nomePet,
        raca,
        sexo,
        contato,
      })
    
    .then((cadastro) => {
        console.log('Cadastrado realizado com sucesso!');
        res.redirect('/listaCadastro');
      })
      .catch((erro) => {
        console.log('Erro ao realizar cadastro: ' + erro);
        res.status(500).send('Erro interno do servidor');
      });
});
app.get('/listaCadastro', (req, res) => {
    cadastro.findAll()
      .then((resultados) => {
        const tabelaHTML = `<table border="1">
          <tr>
            <th>Tutor</th>
            <th>Endereço</th>
            <th>Nome do Pet</th>
            <th>Raça</th>
            <th>Sexo</th>
            <th>Contato</th>
          </tr>
          ${resultados.map((resultado) => `
            <tr>
              <td>${resultado.tutor}</td>
              <td>${resultado.endereco}</td>
              <td>${resultado.nomePet}</td>
              <td>${resultado.raca}</td>
              <td>${resultado.sexo}</td>
              <td>${resultado.contato}</td>
            </tr>`).join('')}
          </table>`;
  
        res.send(tabelaHTML);
      })
      .catch((erro) => {
        console.log('Erro ao obter dados de cadastro: ' + erro);
        res.status(500).send('Erro interno do servidor');
      });
  });
app.listen(PORT, () => {
    console.log("http://localhost:" + 3000 + '/petShop.html');
});