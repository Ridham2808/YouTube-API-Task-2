const express = require('express');
const { MongoClient, ObjectId  } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "youtube";

// Middleware
app.use(express.json());

let db, videos;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        videos = db.collection("videos");

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

// GET: List all videos
app.get('/videos', async (req, res) => {
    try {
        const allvideos = await videos.find().toArray();
        res.status(200).json(allvideos);
    } catch (err) {
        res.status(500).send("Error fetching videos: " + err.message);
    }
});


// GET: List a video by videoId
app.get('/videos/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId; // Keep videoId as a string
        const video = await videos.findOne({ videoId: videoId }); // Query using videoId field
        if (video) {
            res.status(200).json(video);
        } else {
            res.status(404).send("Video not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching video: " + err.message);
    }
});


// POST: Add a new video
app.post('/videos', async (req, res) => {
    try {
        const newVideo = req.body;
        if (newVideo.uploadDate) {
            newVideo.uploadDate = new Date(newVideo.uploadDate);
        }
        const result = await videos.insertOne(newVideo);
        res.status(201).send(`Video added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding video: " + err.message);
    }
});


// PATCH: Partially update a video
app.patch('/videos/:videoID', async (req, res) => {
    try {
        const videoID = req.params.videoID;
        const updates = req.body;
        const result = await videos.updateOne(
            { videoId: videoID },
            updates
        );
        if (result.matchedCount === 0) {
            res.status(404).send("Video not found");
        } else {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        }
    } catch (err) {
        res.status(500).send("Error partially updating video: " + err.message);
    }
});


// DELETE: Remove a video by videoId
app.delete('/videos/:videoid', async (req, res) => {
    try {
        const videoid = req.params.videoid;
        const result = await videos.deleteOne({ videoId: videoid });

        if (result.deletedCount === 0) {
            res.status(404).send("Video not found");
        } else {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        }
    } catch (err) {
        res.status(500).send("Error deleting video: " + err.message);
    }
});