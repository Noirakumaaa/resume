const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const path = require('path');
const db = require('./script');

const app = express();


db.createbankAccountDb()

app.use(session({
  secret: 'your-secret-key', // Change this to a long random string
  resave: false,
  saveUninitialized: true
}));


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'static')));

// Routes

app.get('/getData', async (req, res) => {
    try {
        const email = req.session.email; // Assuming you have stored the logged-in user's email in the session
        const balance = await db.getBalance(email);
        console.log(balance) // Get the balance for the logged-in user
        res.json({ balance }); // Send the balance data back to the client in JSON format
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Internal server error' }); // Send an error response if there's an issue
    }
});

app.get('/deposit',(req,res)=>{
    res.sendFile(path.join(__dirname, 'static', 'deposit.html'));
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
});
app.get('/withdraw',(req,res)=>{
    res.sendFile(path.join(__dirname, 'static', 'withdraw.html'));
})
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'register.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'main.html'));
});

app.post('/register', (req, res) => {
    console.log(req.body);
    db.saveAccountoDatabase(req.body['email'],req.body['username'], req.body['password'],req.body['pin'],req.body['birthday'],req.body['phone'],); // Use correct field names
    res.redirect('/login');
});


app.post('/deposit',(req,res)=>{
    console.log(req.body);
    const depositAmount = parseFloat(req.body.amount); // Parse withdrawal amount as a float
    const email = req.session.email;

    if (isNaN(depositAmount) || depositAmount <= 0) {
        console.log("Invalid withdrawal amount");
        res.redirect('/main'); // Redirect back to main page if withdrawal amount is invalid
        return;
    }

    db.deposit(depositAmount, email);
    res.redirect('/main'); // Redirect back to main page after processing withdrawal
})
app.post('/withdraw', (req, res) => {
    console.log(req.body);
    const withdrawAmount = parseFloat(req.body.amount); // Parse withdrawal amount as a float
    const email = req.session.email;

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        console.log("Invalid withdrawal amount");
        res.redirect('/main'); // Redirect back to main page if withdrawal amount is invalid
        return;
    }

    db.withdraw(withdrawAmount, email);
    res.redirect('/main'); // Redirect back to main page after processing withdrawal
});

app.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const isAuthenticated = await db.getdatatoAccountDatabase(email, password);
        console.log("Is Authenticated:", isAuthenticated);
        if (isAuthenticated) {
            req.session.email = email;
            console.log(req.session.email) 
            res.redirect('/main'); 
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal server error');
    }
});






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
