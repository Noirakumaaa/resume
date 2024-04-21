const sqlite3 = require('sqlite3').verbose();

// Open a database connection
const db = new sqlite3.Database('C:/Users/AMD PC/Documents/GitHub/JullieJS/bankSystem/bankSystem.db'); // Adjust the file path as needed

// Execute SQL commands
const createBankDatabase = () => { 
    const BankDatabasequery = `
    CREATE TABLE IF NOT EXISTS Bankusers (
        id INTEGER PRIMARY KEY,
        Username TEXT,
        Pin INTEGER,
        Balance INTEGER
    )
`;

    db.run(BankDatabasequery, (err) => {
        if (err) {
            console.error("Error creating Bankusers table:", err.message);
        } else {
            console.log("Bankusers table created successfully.");
        }
    });
};

const createbankAccountDb = () => {
    const bankAccountDb = `
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY,
        Username TEXT,
        Password TEXT
    )
    `;
    db.run(bankAccountDb, (err) => {
        if (err) {
            console.error("Error creating accounts table:", err.message);
        } else {
            console.log("Accounts table created successfully.");
        }
    });
};

const saveAccountoDatabase = (username,password) => {
    Username = username
    Password = password
    console.log(Username)
    console.log(Password)
    const query = "SELECT * FROM accounts WHERE Username = ?";
    db.get(query, [Username], (err, row) => {
        if (err) {
            console.error("Error checking existing account:", err.message);
        } else if (row) {
            console.log("Account with username already exists:", Username);
        } else {
            const insertQuery = "INSERT INTO accounts (Username, Password) VALUES (?, ?)";
            db.run(insertQuery, [Username, Password], (err) => {
                if (err) {
                    console.error("Error inserting into accounts:", err.message);
                } else {
                    console.log("Data inserted into accounts successfully.");
                }
            });
        }
    });
};

const savetoDatabaseBank = (Username, Pin, Balance) => {
    const query = "SELECT * FROM Bankusers WHERE Username = ?";
    db.get(query, [Username], (err, row) => {
        if (err) {
            console.error("Error checking existing bank user:", err.message);
        } else if (row) {
            console.log("Bank user with username already exists:", Username);
        } else {
            const insertQuery = "INSERT INTO Bankusers (Username, Pin, Balance) VALUES (?, ?, ?)";
            db.run(insertQuery, [Username, Pin, Balance], (err) => {
                if (err) {
                    console.error("Error inserting into Bankusers:", err.message);
                } else {
                    console.log("Data inserted into Bankusers successfully.");
                }
            });
        }
    });
};


const getdatatoDatabase = () => {
    const selectDataQuery = `
    SELECT * FROM Bankusers
`;

    db.all(selectDataQuery, [], (err, rows) => {
        if (err) {
            console.error("Error selecting data:", err.message);
        } else {
            rows.forEach(row => {
                const id = row.id;
                const UserN = row.Username;
                const pinN = row.Pin;
                const bal = row.Balance;
                console.log(`ID: ${id}, Name: ${UserN}, Pin: ${pinN}, Balance: ${bal}`);
            });
        }
    });
};

const getdatatoAccountDatabase = (userN, passN) => {
    return new Promise((resolve, reject) => {
        const selectDataQuery = "SELECT * FROM accounts WHERE Username = ?";
        db.get(selectDataQuery, [userN], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row && row.Password === passN) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
};



createBankDatabase()
createbankAccountDb()

module.exports = {
    db, // Export the db object
    saveAccountoDatabase,
    savetoDatabaseBank,
    getdatatoDatabase,
    getdatatoAccountDatabase 
};
