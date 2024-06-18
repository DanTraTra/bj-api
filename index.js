require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = express();

app.set('trust proxy', 1);  // Trust first proxy

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://daaaaan.com',
    'https://api.daaaaan.com',
    'https://bj-teacher-server-env-1.eba-n9at9mkt.ap-southeast-2.elasticbeanstalk.com',
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Enable preflight across-the-board
app.use(express.json());

initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://your-database-name.firebaseio.com"
});

const db = getFirestore();

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Optionally check the database connection
        const doc = await db.collection('healthCheck').doc('status').get();
        if (!doc.exists) {
            res.status(404).send('No health check document found');
        } else {
            res.status(200).send('Healthy');
        }
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).send('Unhealthy');
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const snapshot = await db.collection('userscore').get();
        const userscore = snapshot.docs.map(doc => doc.data());
        res.json(userscore);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error', details: err.message});
    }
});

// Add a new user score
app.post('/api/add-score', async (req, res) => {
    const {username, game_log_data} = req.body;
    try {
        const docRef = await db.collection('userscore').add({
            username,
            game_log_data
        });
        const doc = await docRef.get();
        res.json(doc.data());
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
