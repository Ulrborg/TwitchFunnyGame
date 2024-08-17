const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const tmi = require('tmi.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let votes = [0, 0, 0, 0]; // Votes for quiz choices
let languageVotes = { FRENCH: 0, ENGLISH: 0 }; // Votes for language change
let currentLanguage = 'ENGLISH'; // Default language

// Function to handle quiz votes
function handleVote(choiceIndex) {
    if (choiceIndex >= 0 && choiceIndex < votes.length) {
        votes[choiceIndex]++;
        console.log(`Vote registered for choice ${choiceIndex + 1}`);
        io.emit('voteUpdate', votes); // Emit updated votes to all clients
    }
}

// Function to handle language change votes
function handleLanguageVote(language) {
    if (languageVotes[language] !== undefined) {
        languageVotes[language]++;
        console.log(`Vote registered for language ${language}`);
        checkLanguageChange();
    }
}

// Function to check if the language should be changed
function checkLanguageChange() {
    const totalVotes = languageVotes.FRENCH + languageVotes.ENGLISH;
    if (totalVotes > 0) {
        const majorityThreshold = totalVotes / 2;
        if (languageVotes.FRENCH > majorityThreshold) {
            currentLanguage = 'FRENCH';
            io.emit('languageChange', currentLanguage);
            resetLanguageVotes();
        } else if (languageVotes.ENGLISH > majorityThreshold) {
            currentLanguage = 'ENGLISH';
            io.emit('languageChange', currentLanguage);
            resetLanguageVotes();
        }
    }
}

// Function to reset the language votes
function resetLanguageVotes() {
    languageVotes = { FRENCH: 0, ENGLISH: 0 };
}

// TMI.js client configuration to connect to Twitch
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: 'YOUR TWITCH USERNAME', // Replace with your Twitch username
        password: 'oauth:your_oautch_id' // Replace with your OAuth token,
    },
    channels: ['YOUR TWITCH USERNAME'] // Replace with your Twitch channel name
});

// Connect to Twitch chat
client.connect();

// Handle chat messages
client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages sent by the bot itself

    const voteCommand = message.trim().toLowerCase();
    if (voteCommand.startsWith('!vote ')) {
        const choice = parseInt(voteCommand.split(' ')[1], 10);
        if (!isNaN(choice) && choice >= 1 && choice <= 4) {
            handleVote(choice - 1); // Register the vote (array indices start at 0)
        }
    } else if (voteCommand.startsWith('!lang select ')) {
        const lang = voteCommand.split(' ')[2].toUpperCase();
        handleLanguageVote(lang);
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    socket.on('resetVotes', () => {
        votes = [0, 0, 0, 0];
        console.log('Votes reset on the server side');
        io.emit('voteUpdate', votes); // Emit reset votes to all clients
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server started !');
});

// Serve static files
app.use(express.static('public'));
