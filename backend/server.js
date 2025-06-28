require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db'); 
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

function checkAuthentication(req, res, next) {
    const allowedPaths = ['/login.html', '/signup.html', '/', '/logout'];
    const allowedExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];

    if (allowedPaths.includes(req.path)) {
        return next();
    }

    // Allow static assets by extension
    if (allowedExtensions.some(ext => req.path.endsWith(ext))) {
        return next();
    }

    // Allow assets folder if you use it
    if (req.path.startsWith('/assets/')) {
        return next();
    }

    if (req.session.user) {
        return next();
    }

    res.redirect('/login.html');
}

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

app.post('/signup', async (req, res) => {
    //Receive data from form submission
    const { username, password } = req.body;
    //Validate username and password
    if(!usernameRegex.test(username)) {
        return res.status(400).send('Invalid username. It must be 4-20 characters long and can only contain letters, numbers, and underscores.');
    }
    if(!passwordRegex.test(password)) {
        return res.status(400).send('Invalid password. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }
    
    try {
        //Check if user already exists
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).send('Username already exists.');
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Insert new user into the database
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        //Redirect to login page
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again later.');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        //Check if user exists
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        //If user does not exist
        if (!user) {
            return res.status(401).send('Invalid Credentials');
        }
        //Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = { username: user.username,
                user_id: user.user_id
             };
            //Login successful
            res.redirect('/home.html');
        } else {
            res.status(401).send('Login failed. Invalid username or password.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again later.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error. Please try again later.');
        }
        res.redirect('/login.html');
    });
});

app.use(checkAuthentication);

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.get('/:page.html', (req, res) => {
    if (!req.session.user) return res.redirect('/login.html');

    const allowedPages = ['home', 'game', 'leaderboard', 'feedback']; // whitelist only
    const page = req.params.page;

    if (!allowedPages.includes(page)) {
        return res.status(404).send('Page not found');
    }

    res.sendFile(path.join(__dirname, `../frontend/protected/${page}.html`));
});

app.post('/feedback', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    const user_id = req.session.user.user_id;
    const message = req.body.message;

    try {
        // Insert feedback into the database
        await db.query('INSERT INTO feedback (user_id, message) VALUES (?, ?)', [user_id, message]);
        res.redirect('/feedback.html?success=true');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




