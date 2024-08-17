const tmi = require('tmi.js');

// Initialize the votes array
let votes = [0, 0, 0, 0];

// Function to handle quiz votes
function handleVote(choiceIndex) {
    if (choiceIndex >= 0 && choiceIndex < votes.length) {
        votes[choiceIndex]++;
        console.log(`Vote registered for choice ${choiceIndex + 1}`);
    } else {
        console.log("Invalid choice");
    }
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
    }
});

// Export `votes` to make it accessible to `app.js`
module.exports = {
    votes
};
