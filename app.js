const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Changed 'body' to 'bodyParser'
const path = require('path');
const { saveAccountoDatabase,getdatatoAccountDatabase  } = require('./script'); // Corrected function name

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Add JSON body parsing

// Serve static files from the 'static' directory
app.use('/public', express.static(path.join(__dirname, 'static')));

// Define routes
app.get('/', (req, res) => {
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
    saveAccountoDatabase(req.body['email'],req.body['username'], req.body['password'],req.body['pin'],req.body['birthday'],req.body['phone'],); // Use correct field names
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.post('/login', async (req, res) => {
    console.log(req.body)
    console.log(req.body['username'])
    console.log(req.body['password'])
    try {
        const isAuthenticated = await getdatatoAccountDatabase(req.body['username'], req.body['password']);
        if (isAuthenticated) {
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
