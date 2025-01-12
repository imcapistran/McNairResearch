const mysql = require('mysql2'); //Database

//Creating a connection to the MySQL Database.
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'root',
    database: 'database_mcnair'
});

//Connection to the database
db.connect(err => {
    if(err) {
        console.error('Database connection has failed:', err);
        return;
    }
    console.log('Connected to the MySQL Database.');
});

module.exports = db; //Exporting the database connection.