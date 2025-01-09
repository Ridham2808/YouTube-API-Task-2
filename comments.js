const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "youtube";

// Middleware
app.use(express.json());

let db, comments;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        comments = db.collection("Comments");

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

// 1. GET /comments/:videoId: Fetch comments for a specific video
app.get('/comments/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const videoComments = await comments.find({ videoId: videoId }).toArray();
        res.status(200).json(videoComments);
    } catch (err) {
        res.status(500).send("Error fetching comments: " + err.message);
    }
});

// POST /comments: Add a comment to a video
app.post('/comments', async (req, res) => {
    try {
        const newComment = req.body;
        if (newComment.postedAt) {
            newComment.postedAt = new Date(newComment.postedAt);
        }
        const result = await comments.insertOne(newComment);
        res.status(201).send(`Comment added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding comment: " + err.message);
    }
});


// PATCH: Increment likes for a comment by commentId
app.patch('/comments/:commentId/likes', async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await comments.updateOne(
            { commentId: commentId },
            { $inc: { likes: 1 } }
        );
        if (result.matchedCount === 0) {
            res.status(404).send("Comment not found");
        } else {
            res.status(200).send(`${result.modifiedCount} comment(s) updated`);
        }
    } catch (err) {
        res.status(500).send("Error updating likes: " + err.message);
    }
});


// 4. DELETE /comments/:commentId: Delete a comment
app.delete('/comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await comments.deleteOne({ commentId: commentId });
        if (result.deletedCount === 0) {
            res.status(404).send("Comment not found");
        } else {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        }
    } catch (err) {
        res.status(500).send("Error deleting comment: " + err.message);
    }
});