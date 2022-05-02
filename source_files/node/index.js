const express = require('express')
const random_name = require('node-random-name');

const app=express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql')

app.get('/', (req, res) => {
    const connection = mysql.createConnection(config)
    connection.query(`INSERT INTO user SET ?`, { name: random_name()}, function(error, results, fields) {
        
        connection.query(`SELECT * FROM user`, function(error, results, fields) {
            connection.end();

            const listUsersToHtml = results.map(user => `<li>${user.id} ${user.name}</li>`).join('')

            const responseBody = `
                <h1>Full Cycle Rocks!</h1>

                <ul>
                    ${listUsersToHtml}
                </ul>
            `

            res.send(responseBody)
        })

    })
})

app.listen(port, () => {
    console.log(`Listening port ${port}.`)

    const connection = mysql.createConnection(config)
    const createTableIfNotExists = `create table IF NOT EXISTS user(id int not null auto_increment, name varchar(255), primary key(id));`
    connection.query(createTableIfNotExists)
    connection.end()
})