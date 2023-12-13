const express = require("express");
const path = require("path");
const fs = require('fs-extra');

const participantRoute = require('./src/route/participant');
const winnerRoute = require('./src/route/winner');
const prizeRoute = require('./src/route/prize');

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(participantRoute, winnerRoute, prizeRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
})

app.get('/participants', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/participants.html'));
})

app.get('/prizes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/prizes.html'));
})

app.get('/raffle', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/raffle.html'));
})

app.get('/winners', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/winners.html'));
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`OPEN: http://localhost:${PORT}`)
});