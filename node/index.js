const express = require('express')
const request = require('request-promise-native');
const app = express()
const port = 3000

const options = {
    method: 'GET',
    uri: 'https://api.namefake.com/'
}

const config = {
    host: 'nodedb',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
const mysql = require('mysql')
const connection = mysql.createConnection(config)

const executaQuery = (query, parametros = ' ') => {
    return new Promise ((resolve, reject) => {
    connection.query(query, parametros, (erros, resultados, campos) => {
            if(erros) {
                reject(erros)
            } else {
                resolve(resultados)
            }
        })
    })
}

app.get('/ping', (req,res) => {res.status(200).send("OK")});

app.get('/', (req,res) => {
    
   request(options).then(response => {
    const insert = `INSERT INTO people(name) values('${JSON.parse(response).name}')`
        executaQuery(insert).then(()=>{
            var query = 'SELECT Name FROM people';
            executaQuery(query).then((rows,rj)=>{
                var names=""
                for (var i in rows) {
                    names += "<li>" + rows[i].Name + "</li>";
                }
                var result = `<h1>Full Cycle Rocks!!!</h1>
                          <h3>Cada request insere um novo nome de forma aleatória</h3>
                          <ul>${names}</ul>
                `
                res.send(result)
            });
        })
    }, error => {
        res.status(500).send(error)
        console.log(error);
    });
   
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})