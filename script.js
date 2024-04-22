const { query } = require('express');
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bankUser'
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err.message);
      return;
    }
    console.log('Connected to MySQL database.');
  });

const createbankAccountDb = () => {
    const bankAccountDb = `
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        email TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        pin INTEGER NOT NULL,
        birthday DATE NOT NULL,
        phone TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    db.query(bankAccountDb, (err) => {
        if (err) {
            console.error("Error creating accounts table:", err.message);
        } else {
            console.log("Accounts table created successfully.");
        }
    });
};

const saveAccountoDatabase = (email, username, password, pin, birthday, phone) => {
    const query = "SELECT * FROM accounts WHERE email = ?";
    db.query(query, [email], (err, rows) => {
        if (err) {
            console.error("Error checking existing account:", err.message);
        } else if (rows.length > 0) {
            console.log("Account with email already exists:", email);
        } else {
            const insertQuery = "INSERT INTO accounts (email, username, password, pin, birthday, phone) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertQuery, [email, username, password, pin, birthday, phone], (err) => {
                if (err) {
                    console.error("Error inserting into accounts:", err.message);
                } else {
                    console.log("Data inserted into accounts successfully.");
                }
            });
        }
    });
};


const getdatatoAccountDatabase = (email, password) => {
    return new Promise((resolve, reject) => {
        const selectDataQuery = "SELECT * FROM accounts WHERE email = ?";
        db.query(selectDataQuery, [email], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length > 0 && rows[0].password === password) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
};



const getAllAccounts = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM accounts";
        db.query(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {
    db, // Export the db object
    saveAccountoDatabase,
    getdatatoAccountDatabase,
    createbankAccountDb,
    getAllAccounts
};
