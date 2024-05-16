require('dotenv').config();
const https = require('https');
const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1);  // Trust first proxy

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://daaaaan.com',
    'https://api.daaaaan.com',
];

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

https.createServer(options, app).listen(3000, () => {
    console.log('Server is running on HTTPS at port 3000');
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: true, // Note: For production, you should have valid certificates and not use rejectUnauthorized: false
        ca: fs.readFileSync('/Users/dantra/Documents/Personal/ap-southeast-2-bundle.pem').toString()
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Optionally check the database connection
        const client = await pool.connect();  // Attempt to get a connection from the pool
        // console.log("client", client)
        client.release();  // Release the connection back to the pool
        res.status(200).send('Healthy');
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).send('Unhealthy');
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
