require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://bj-teacher-server-env-1.eba-n9at9mkt.ap-southeast-2.elasticbeanstalk.com'];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],  // Ensure headers are explicitly allowed
    credentials: true,  // If your API requires cookies or authentication headers
    preflightContinue: false,
    optionsSuccessStatus: 204  // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Enable preflight across-the-board
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Note: For production, you should have valid certificates and not use rejectUnauthorized: false
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM userscore');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error', details: err.message});
    }
});


// Add a new user score
app.post('/api/add-score', async (req, res) => {
    const {username, game_log_data} = req.body;  // assuming the body contains user_id and score
    try {
        const result = await pool.query('INSERT INTO userscore (username, game_log_data) VALUES ($1, $2) RETURNING *', [username, game_log_data]);
        res.json(result.rows[0]);  // Send back the inserted row
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error', err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
