let mysql = require('mysql');

let connection = mysql.createConnection({
    host:   'localhost',
    user:   'root',
    password:   '',
    database:   'db_xirpl_08'
});

connection.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log('\x1b[31m%s\x1b[0m', '@Dao:', '\x1b[37m\x1b[0m', 'Connected');
    }
})

module.exports = connection;