const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "youtube";

// Middleware
app.use(express.json());

let db, subscriptions;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        subscriptions = db.collection("Subscriptions");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// 1. GET /subscriptions/:userId: Fetch subscriptions for a user
app.get('/subscriptions/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userSubscriptions = await subscriptions.find({ subscriber: userId }).toArray();
        res.status(200).json(userSubscriptions);
    } catch (err) {
        res.status(500).send("Error fetching subscriptions: " + err.message);
    }
});

// 2. POST /subscriptions: Subscribe to a channel
app.post('/subscriptions', async (req, res) => {
    try {
        const newSubscription = req.body;
        newSubscription.subscribedAt = new Date();
        const result = await subscriptions.insertOne(newSubscription);
        res.status(201).send(`Subscribed to channel with subscription ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error subscribing to channel: " + err.message);
    }
});