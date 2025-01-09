# YouTube-Inspired API Documentation

## Overview
This project is a YouTube-inspired API that allows users to manage profiles, videos, comments, playlists, and subscriptions. It simulates a platform where users can upload videos, comment on them, create playlists, and subscribe to channels. This API is built using MongoDB and provides all essential operations for handling user interactions.

For detailed API documentation, please refer to the Postman collection:  

[API Postman Collection Link](https://documenter.getpostman.com/view/39189278/2sAYQUptZd)

[Google Drive Link](https://drive.google.com/file/d/15IYeOTHwBR_Rxm7lKVMBANWnM5_e3pru/view?usp=sharing)


## Table of Contents
- User Management
- Videos
- Comments
- Playlists
- Subscriptions

## User Management
### Endpoints
- **GET /users**: Fetch all users.
- **GET /users/:userId**: Fetch user details by ID.
- **POST /users**: Create a new user.
- **PATCH /users/:userId**: Update user profile information (e.g., profile picture).
- **DELETE /users/:userId**: Delete a user account.

### Description
The user management feature allows the creation, retrieval, updating, and deletion of user profiles. Users can have attributes such as name, email, channel name, subscribers count, profile picture, and more.

## Videos
### Endpoints
- **GET /videos**: Fetch all videos.
- **GET /videos/:videoId**: Fetch a specific video by ID.
- **POST /videos**: Upload a new video.
- **PATCH /videos/:videoId/likes**: Increment likes for a specific video.
- **DELETE /videos/:videoId**: Delete a video.

### Description
The video feature allows users to upload, view, and interact with videos. Each video has properties like title, description, uploader, views, likes, dislikes, tags, and video URL.

## Comments
### Endpoints
- **GET /videos/:videoId/comments**: Fetch all comments for a specific video.
- **POST /comments**: Add a comment to a video.
- **PATCH /comments/:commentId/likes**: Increment likes for a comment.
- **DELETE /comments/:commentId**: Delete a comment.

### Description
Comments enable user interaction on videos. Each comment is associated with a video and includes the comment text, user who posted it, likes, and timestamps.

## Playlists
### Endpoints
- **GET /playlists/:userId**: Fetch all playlists created by a user.
- **POST /playlists**: Create a new playlist.
- **PUT /playlists/:playlistId/videos**: Add a video to a playlist.
- **DELETE /playlists/:playlistId**: Delete a playlist.

### Description
Playlists allow users to organize their videos. Each playlist contains videos and has properties such as visibility (public/private) and creation date.

## Subscriptions
### Endpoints
- **GET /subscriptions/:userId**: Fetch all subscriptions for a user.
- **POST /subscriptions**: Subscribe to a channel.

### Description
The subscription feature tracks which channels a user is subscribed to. It helps users stay updated with new videos from their favorite creators.