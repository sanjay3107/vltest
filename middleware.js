const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'dummy'; 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

app.get('/login', (req, res) => {
    const user = { id: 1, username: 'testuser' }; 
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


app.get('/add', authenticateToken, (req, res) => {
    const num1 = req.query.num1;
    const num2 = req.query.num2;
    if (!num1 || !num2) {
        return res.status(400).json({ message: 'Missing parameters. Please provide num1 and num2.' });
    }

    const parsedNum1 = parseFloat(num1);
    const parsedNum2 = parseFloat(num2);

    if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
        return res.status(400).json({ message: 'Invalid input. Both num1 and num2 should be numbers.' });
    }

    const sum = parsedNum1 + parsedNum2;
    res.json({ result: sum });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
