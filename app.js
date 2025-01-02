import express from 'express';
import path, {join} from 'path';
const app = express();

import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const db = await sqlite.open({
    filename: './users.db',
    driver: sqlite3.Database
});

const __dirname = path.resolve();

const port = 3000;
let Admin_MFA;
let user_MFA;

// Parse form data sent by front-end pages, otherwise req will show as undefined
app.use(express.urlencoded({ extended: true }));

// Sends home page
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Sends admin login page
app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, 'admin.html'));
});

// Sends robots.txt for restricting crawlers
app.get('/robots.txt', (req, res) => {
    res.sendFile(join(__dirname, 'robots.txt'));
});

// Sends styles.css for styling of front end pages
app.get('/styles.css', (req, res) => {
    res.sendFile(join(__dirname, 'styles.css'));
});

// Sends mfa code for normal users, random 6 digits each time
app.get('/mfa', (req, res) => {
    user_MFA = Math.floor(100000 + Math.random() * 900000);
    res.json({
        code: user_MFA
    });
});

// Sends mfa code for admin, random 6 digits each time
app.get('/admin-mfa', (req, res) => {
    Admin_MFA = Math.floor(100000 + Math.random() * 900000);
    res.json({
        code: Admin_MFA
    });
});

// Proceeds to user-mfa during user login if credentials are valid, otherwise returns login-error page
app.post('/user-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const row = await db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password]);

        if (row) {
            res.sendFile(join(__dirname, 'user-mfa.html'));
        }
        else {
            res.sendFile(join(__dirname, 'login-error.html'));
        }
    }
    catch (err) {
        console.log("Error getting user details from db:\n", err);
        res.sendFile(join(__dirname, 'login-error.html'));
    }
});

// Sends user home page if mfa code is valid, otherwise returns login-error page
app.post('/user-home', (req, res) => {
    const {mfa} = req.body;

    if (mfa == user_MFA) {
        res.sendFile(join(__dirname, 'user-home.html'));
    }
    else {
        res.sendFile(join(__dirname, 'login-error.html'));
    }
});

// Proceeds to admin-mfa during admin login if credentials are valid, otherwise returns login-error page
app.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const row = await db.get(`SELECT * FROM users WHERE username = ? AND password = '${password}'`, [username]);
        
        if (row) {
            res.sendFile(join(__dirname, 'admin-mfa.html'));
        }
        else {
            res.sendFile(join(__dirname, 'login-error.html'));
        }
    }
    catch (err) {
        console.log("Error getting user details from db:\n", err);
        res.sendFile(join(__dirname, 'login-error.html'));
    }
});

// Sends admin home page if mfa code is valid, otherwise returns login-error page
app.post('/admin-home', (req, res) => {
    const {mfa} = req.body;

    if (mfa == Admin_MFA) {
        res.sendFile(join(__dirname, 'admin-home.html'));
    }
    else {
        res.sendFile(join(__dirname, 'login-error.html'));
    }
});

// Populates user details table on admin home page using sqlite3 db table users, returns blank json in case of error with db
app.get('/user-details', async (req, res) => {
    try {
        const row = await db.all('SELECT * FROM users', []);
        
        if (row) {
            res.json(row)  
        }
        else {
            console.log("Error getting user details from db:\n", err);
            res.json({});
        }
    }
    catch (err) {
        console.log("Error getting user details from db:\n", err);
        res.json({});
    }
});

// Start app on localhost port, where port is defined as const variable above
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});

// Closes db when app stopped manually like Ctrl+C
process.on('SIGINT', async () => {
    console.log('Closing database...');
    await db.close();
    console.log('Database closed.');
    process.exit();
});

// Closes db when app exits for any other reason like uncaught exception
process.on('exit', async () => {
    console.log('Closing database...');
    await db.close();
    console.log('Database closed.');
});