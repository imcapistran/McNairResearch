const express = require('express'); //Server
const session = require('express-session'); //Server session management
const bodyParser = require('body-parser'); //Parse requests
const bcrypt = require('bcrypt'); //Hash passwords
const path = require('path'); //initialize path to application

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret', // Change this to a strong secret
    resave: false,
    saveUninitialized: true
}));

//Login page will be default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Math-a-mob', 'public', 'login', 'login.html'));
});

app.use(express.static(path.join(__dirname, 'Math-a-mob', 'public', 'login')));

//Serves files from the public directory
app.use(express.static(path.join(__dirname, 'Math-a-mob', 'public')));


// Login endpoint
app.post('/login.html', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
        req.session.userId = user.username; // Create session
        res.send('Login successful!');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.get('/audio', (req, res) => {
    res.sendFile(path.join(__dirname, 'Math-a-mob', 'public', 'audio', 'audio.m4a'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


