const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

app.get('/data', async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM userscore');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


// Add a new user score
app.post('/add-score', async (req, res) => {
    const { user_id, score } = req.body;  // assuming the body contains user_id and score
    try {
        const result = await pool.query('INSERT INTO userscore (user_id, score) VALUES ($1, $2) RETURNING *', [user_id, score]);
        res.json(result.rows[0]);  // Send back the inserted row
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
