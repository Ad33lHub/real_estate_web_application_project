const express = require('express');
const router = express.Router();
const { connectToDb, sql } = require('./db');


// Registration API
router.post('/register', async (req, res) => {
    const {
        firstName, lastName, email, phone,
        password, cnic, country, city, gender
    } = req.body;

    try {
        const pool = await sql.connectToDb();

        // Check if email already exists
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (result.recordset.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Insert user
        await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('email', sql.VarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('password', sql.VarChar, password)
            .input('cnic', sql.VarChar, cnic)
            .input('country', sql.VarChar, country)
            .input('city', sql.VarChar, city)
            .input('gender', sql.VarChar, gender)
            .query(`
                INSERT INTO Users
                (firstName, lastName, email, phone, password, cnic, country, city, gender) 
                VALUES (@firstName, @lastName, @email, @phone, @password, @cnic, @country, @city, @gender)
            `);

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await connectToDb();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM Users WHERE email = @email AND password = @password');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            return res.json({ message: 'Login successful', user, token: 'dummy-token' }); // Replace with JWT if needed
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
