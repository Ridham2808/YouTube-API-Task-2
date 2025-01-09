const express = require('express');
const { MongoClient, ObjectId  } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "youtube";

// Middleware
app.use(express.json());

let db, users;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");

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

// GET: List all users
app.get('/users', async (req, res) => {
    try {
        const allusers = await users.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});


// // GET: List all users by id
app.get('/users/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        const user = await users.findOne({ _id: new ObjectId(userid) });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching user: " + err.message);
    }
});

// POST: Add a new user
app.post('/users', async (req, res) => {
    try {
        const newuser = req.body;
        const result = await users.insertOne(newuser);
        res.status(201).send(`user added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

// PATCH: Partially update a user
app.patch('/users/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const updates = req.body;
        const result = await users.updateOne(
            { userId: userID },
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        }
    } catch (err) {
        res.status(500).send("Error partially updating user: " + err.message);
    }
});

// DELETE: Remove a user by userId
app.delete('/users/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        const result = await users.deleteOne({ userId: userid });

        if (result.deletedCount === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        }
    } catch (err) {
        res.status(500).send("Error deleting user: " + err.message);
    }
});