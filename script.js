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
        balance INTEGER NOT NULL,
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
            const insertQuery = "INSERT INTO accounts (email, username, password, pin, birthday, phone,balance) VALUES (?, ?, ?, ?, ?, ?, ?)";
            db.query(insertQuery, [email, username, password, pin, birthday, phone, 0], (err) => {
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

const getBalance = (email) => {
    return new Promise((resolve, reject) => {
        const getBalanceQuery = "SELECT balance FROM accounts WHERE email = ?";
        db.query(getBalanceQuery, [email], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                if (rows.length > 0) {
                    resolve(rows[0].balance);
                } else {
                    resolve(null);
                }
            }
        });
    });
};



const withdraw = (withdrawAmount, email) => {
    // Check if email is null or undefined
    if (!email) {
        console.log("Email is required");
        return;
    }

    // Convert the withdrawAmount to a number
    const withdraw = parseFloat(withdrawAmount);
    console.log(withdraw)
    if (isNaN(withdraw) || withdraw <= 0) {
        console.log("Invalid withdrawal amount");
        return;
    }

    // Get the current balance
    getBalance(email)
        .then(balance => {
            // Check if the balance is valid
            if (balance === null || isNaN(balance)) {
                console.log("Invalid balance");
                return;
            }

            // Calculate the new balance after withdrawal
            const newBalance = balance - withdraw;

            // Check if the new balance is negative
            if (newBalance < 0) {
                console.log("Insufficient funds");
                return;
            }

            // Update the balance in the database
            const updateBalQuery = "UPDATE accounts SET balance = ? WHERE email = ?";
            db.query(updateBalQuery, [newBalance, email], (err, result) => {
                if (err) {
                    console.error("Error updating balance:", err);
                    return;
                }
                console.log("Withdrawal successful");
            });
        })
        .catch(err => {
            console.error("Error getting balance:", err);
        });
};


const deposit = (depositAmount, email) => {
    // Check if email is null or undefined
    if (!email) {
        console.log("Email is required");
        return;
    }

    // Convert the depositAmount to a number
    const deposit = parseFloat(depositAmount);
    if (isNaN(deposit) || deposit <= 0) {
        console.log("Invalid deposit amount");
        return;
    }

    // Get the current balance
    getBalance(email)
        .then(balance => {
            // Check if the balance is valid
            if (balance === null || isNaN(balance)) {
                console.log("Invalid balance");
                return;
            }

            // Calculate the new balance after deposit
            const newBalance = balance + deposit;

            // Update the balance in the database
            const updateBalQuery = "UPDATE accounts SET balance = ? WHERE email = ?";
            db.query(updateBalQuery, [newBalance, email], (err, result) => {
                if (err) {
                    console.error("Error updating balance:", err);
                    return;
                }
                console.log("Deposit successful");
            });
        })
        .catch(err => {
            console.error("Error getting balance:", err);
        });
};


  

module.exports = {
    db, // Export the db object
    saveAccountoDatabase,
    getdatatoAccountDatabase,
    createbankAccountDb,
    getAllAccounts,
    getBalance,
    withdraw,
    deposit
};
