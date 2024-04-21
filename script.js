const sqlite3 = require('sqlite3').verbose();

// Open a database connection
const db = new sqlite3.Database('static/BankDB.db'); // Adjust the file path as needed


const createbankAccountDb = () => {
    const bankAccountDb = `
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY,
        email TEXT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        pin INTEGER NOT NULL,
        birthday DATE NOT NULL,
        phone TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    db.run(bankAccountDb, (err) => {
        if (err) {
            console.error("Error creating accounts table:", err.message);
        } else {
            console.log("Accounts table created successfully.");
        }
    });
};

const saveAccountoDatabase = (email,username,password,pin,birthday,phone) => {

    const query = "SELECT * FROM accounts WHERE Username = ?";
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error("Error checking existing account:", err.message);
        } else if (row) {
            console.log("Account with username already exists:", Username);
        } else {
            const insertQuery = "INSERT INTO accounts (email,username,password, pin, birthday, Phone) VALUES (?, ?, ?, ?, ?, ?)";
            db.run(insertQuery, [email,username,password,pin,birthday,phone], (err) => {
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
        db.get(selectDataQuery, [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row && row.password === password) {
                    resolve(true);
                } else {
                    console.log(row)
                    resolve(false);
                }
            }
        });
    });
};



module.exports = {
    db, // Export the db object
    saveAccountoDatabase,
    getdatatoAccountDatabase,
    createbankAccountDb
};
