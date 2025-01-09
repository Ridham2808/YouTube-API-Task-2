const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "youtube";

// Middleware
app.use(express.json());

let db, playlists;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        playlists = db.collection("Playlists");

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

// 1. GET /playlists/:userId: Fetch all playlists for a user
app.get('/playlists/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userPlaylists = await playlists.find({ userId: userId }).toArray();
        res.status(200).json(userPlaylists);
    } catch (err) {
        res.status(500).send("Error fetching playlists: " + err.message);
    }
});

// 2. POST /playlists: Create a new playlist
app.post('/playlists', async (req, res) => {
    try {
        const newPlaylist = req.body;
        newPlaylist.createdDate = new Date();
        const result = await playlists.insertOne(newPlaylist);
        res.status(201).send(`Playlist created with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating playlist: " + err.message);
    }
});

// 3. PUT /playlists/:playlistId/videos: Add a video to a playlist
app.put('/playlists/:playlistId/videos', async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const { videoId } = req.body; // Expecting videoId in the request body
        const result = await playlists.updateOne(
            { playlistId: playlistId },
            { $push: { videos: videoId } }
        );
        if (result.matchedCount === 0) {
            res.status(404).send("Playlist not found");
        } else {
            res.status(200).send(`Video added to playlist: ${playlistId}`);
        }
    } catch (err) {
        res.status(500).send("Error adding video to playlist: " + err.message);
    }
});

// 4. DELETE /playlists/:playlistId: Delete a playlist
app.delete('/playlists/:playlistId', async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const result = await playlists.deleteOne({ playlistId: playlistId });
        if (result.deletedCount === 0) {
            res.status(404).send("Playlist not found");
        } else {
            res.status(200).send(`${result.deletedCount} playlist(s) deleted`);
        }
    } catch (err) {
        res.status(500).send("Error deleting playlist: " + err.message);
    }
});
