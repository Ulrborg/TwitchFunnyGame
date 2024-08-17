![image](https://github.com/user-attachments/assets/11e1fa6a-0de9-41a1-86fe-d2a4e471ca0f)


# 🎲 TwitchFunnyGame
Twitch interactive game, question & answer

## 📋 Overview

TwitchFunnyGame is an interactive quiz game designed for Twitch streams. Viewers can participate by voting for the correct answer to quiz questions directly from the chat. The game also supports dynamic language selection based on chat commands.

## 📋 Features

- Real-time interaction with Twitch chat
- Multiple-choice questions
- Dynamic language selection (English/French)
- Live voting with visual feedback
- Progress bar for time remaining
- Automatic transition to the next round after displaying results

## 📌 Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/)

## 💿 Installation

Follow these steps to install and run the project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ulrborg/TwitchFunnyGame.git
   cd TwitchFunnyGame
    ```

2. **Install the required dependencies:**

Navigate to the project directory and install the dependencies using npm:

```bash
npm install
```
This command will install the following packages:

- express: A web framework for Node.js, used to serve static files and handle routing.
- socket.io: A library that enables real-time, bidirectional communication between web clients and servers.
- tmi.js: A Twitch Messaging Interface (TMI) library for interacting with Twitch chat.
- nodemon (optional): A utility that automatically restarts your server when file changes in the directory are detected (useful during development).
These dependencies are defined in the package.json file, so the npm install command will install them automatically.

## 💻 Configuration
## 1 : Set up your Twitch credentials:

Open the server.js file and replace the placeholder values with your Twitch username and OAuth token:

```bash
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: 'your_twitch_username', // Replace with your Twitch username
        password: 'oauth:your_oauth_token' // Replace with your OAuth token
    },
    channels: ['your_twitch_channel'] // Replace with your Twitch channel name
});
```
To generate an OAuth token, you can use [Twitch Token Generator](https://twitchtokengenerator.com/)

## 2 : Customize Questions:

You can modify the questions.json file to customize the quiz questions. Ensure that each question has the correct structure:

```bash
[
    {
        "question": "What is the capital of Italy?",
        "choices": ["Rome", "Milan", "Venice", "Florence"],
        "correctAnswer": 0
    }
    // Add more questions as needed
]
```

## 🔥 Running the Project
To start the server, use one of the following commands:

1 : Standard Mode:

```bash
npm start
```
2 : Development Mode (with auto-restart):

```bash
npm run dev
```
The server will start on http://localhost:3000.

## ℹ️ How to Play
**Starting the Game:**

- Once the server is running, the game will display the first question automatically.
- Voting:
  Viewers can vote for their answer by typing !vote 1, !vote 2, !vote 3, or !vote 4 in the Twitch chat.
- Changing Language:
  Viewers can change the language by typing !lang select FRENCH or !lang select ENGLISH. If a majority votes for a language, the game will switch to that language.
- Next Round:
  After each round, the correct answer is displayed, and the game transitions to the next question automatically.

## 📖 Acknowledgements
- Twitch API: This project uses the Twitch API through tmi.js to interact with the Twitch chat.
- Node.js: A powerful JavaScript runtime that allows us to run JavaScript code server-side.
- Express.js: A minimal and flexible Node.js web application framework.
- Socket.IO: A library that enables real-time, bidirectional communication between web clients and servers.

## 📰 Roadmap
**Future Features:**
- Add support for more languages.
- Implement user-specific commands for more interactivity.
- Add a scoreboard to track user scores across rounds.


