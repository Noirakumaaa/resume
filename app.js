const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Changed 'body' to 'bodyParser'
const path = require('path');
const db = require('./script'); // Corrected function name

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Add JSON body parsing
db.createbankAccountDb()
// Serve static files from the 'static' directory
app.use('/public', express.static(path.join(__dirname, 'static')));

// Define routes
app.get('/', (req, res) => {
    db.getdatatoAccountDatabase()
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'register.html'));
});

// Handle registration form submission
app.post('/register', (req, res) => {
    console.log(req.body);
    db.saveAccountoDatabase(req.body['email'],req.body['username'], req.body['password'],req.body['pin'],req.body['birthday'],req.body['phone'],); // Use correct field names
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.post('/login', async (req, res) => {
    console.log(req.body); // Check if correct data is received
    try {
        const email = req.body['email'];
        const password = req.body['password'];
        const isAuthenticated = await db.getdatatoAccountDatabase(email, password);
        console.log("Is Authenticated:", isAuthenticated); // Add this line for debugging
        if (isAuthenticated) {
            res.sendFile(path.join(__dirname, 'static', 'main.html'));
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal server error');
    }
});

// db.getAllAccounts()
// .then((rows) => {
//     console.log("All accounts in the database:");
//     console.log(rows); // Log rows to see its structure
// })
// .catch((err) => {
//     console.error("Error fetching accounts:", err);
// });
// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
