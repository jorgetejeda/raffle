const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require('fs-extra');

const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

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

const DIRECTORY = './database';

app.post('/particpants/upload', fileUpload({ createParentPath: true }), async (req, res) => {

    const participantCSV = req.files;

    if (!participantCSV) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    if (!participantCSV.csvFile.name.endsWith('.csv')) {
        return res.status(400).json({ status: 'error', message: 'Invalid file type. Only CSV files are allowed.' });
    }

    const participants = participantCSV.csvFile.data.toString('utf8');
    const participantsArray = participants.split('\n').map(participant => participant.split(','));
    participantsArray.shift();
    participantsArray.pop();

    const participantsJSON = participantsArray.map(participant => {

        // generate an unique id using, their names, department and position and add some random numbers
        const id = participant[0].split(' ').join('').toLowerCase() + participant[1].split(' ').join('').toLowerCase() + participant[2].split(' ').join('').toLowerCase() + Math.floor(Math.random() * 1000);
        // use the id and reorder letters to generate a new random id
        const uniqueId = id.split('').sort(() => Math.random() - 0.5).join('');
        return {
            id: uniqueId,
            company: participant[0],
            department: participant[1],
            identification: participant[2],
            name: participant[3] + ' ' + participant[4],
            winner: false,
        }
    });

    fs.mkdirSync(DIRECTORY, { recursive: true });
    fs.writeFileSync('./database/participants.json', JSON.stringify(participantsJSON, null, 2));

    return res.json({ status: '200', message: 'Archivo se ha subido con exito', track: participantCSV })
});

app.delete('/participants/delete', (req, res) => {
    fs.writeFileSync('./database/participants.json', JSON.stringify([], null, 2));
    return res.json({ status: 'success', message: 'success' });
});

app.get('/participants/view', (req, res) => {
    const participants = fs.readFileSync('./database/participants.json', 'utf8');
    return res.json({ status: 'success', message: 'success', participants: JSON.parse(participants) });
});

app.put('/participants/winner/:id/:prizeId', (req, res) => {
    const winnerId = req.params.id;
    let participants = fs.readFileSync('./database/participants.json', 'utf8');
    let prizes = fs.readFileSync('./database/prizes.json', 'utf8');

    const findWinner = JSON.parse(participants).find(participant => participant.id === winnerId);
    participants = JSON.parse(participants).map(participant => {
        if (participant.id === winnerId) {
            return {
                ...participant,
                winner: true,
            }
        }
        return participant;
    });

    prizes = JSON.parse(prizes).map(prize => {
        if (prize.id == req.params.prizeId) {
            return {
                ...prize,
                left: prize.left - 1,
            }
        }
        return prize;
    });

    fs.writeFileSync('./database/prizes.json', JSON.stringify(prizes, null, 2));
    fs.writeFileSync('./database/participants.json', JSON.stringify(participants, null, 2));

    findWinner.amount = prizes.find(prize => prize.id == req.params.prizeId).amount;
    delete findWinner.winner;
    fs.mkdirSync(DIRECTORY, { recursive: true });
    const winners = fs.readFileSync('./database/winners.json', 'utf8');
    if (winners) {
        const winnersArray = JSON.parse(winners);

        winnersArray.push(findWinner);
        fs.writeFileSync('./database/winners.json', JSON.stringify(winnersArray, null, 2));
    } else {
        fs.writeFileSync('./database/winners.json', JSON.stringify([findWinner], null, 2));
    }

    return res.json({ status: 'success', message: 'success' });
});

// Winners
app.get('/winners/view', (req, res) => {
    const winners = fs.readFileSync('./database/winners.json', 'utf8');
    return res.json({ status: 'success', message: 'success', winners: JSON.parse(winners) });
});

app.delete('/winners/delete', (req, res) => {
    fs.writeFileSync('./database/winners.json', JSON.stringify([], null, 2));
    return res.json({ status: 'success', message: 'success' });
});

// Prizes
app.get('/prizes/view', (req, res) => {
    const prizes = fs.readFileSync('./database/prizes.json', 'utf8');
    return res.json({ status: 'success', message: 'success', prizes: JSON.parse(prizes) });
})

app.post('/prizes/upload', async (req, res) => {
    const prizes = req.body;
  
    const prizesArr = prizes.map(prize => ({
            id: new Date().getTime() + Math.floor(Math.random() * 1000),
            amount: prize.amount,
            quantity: prize.quantity,
            left: prize.quantity,
        }
    ));

    fs.mkdirSync(DIRECTORY, { recursive: true });
    fs.writeFileSync('./database/prizes.json', JSON.stringify(prizesArr, null, 2));
    return res.json({ status: 'success', message: "Los premios han sido creado con exito!" });
})

app.delete('/prizes/delete', (req, res) => {
    fs.writeFileSync('./database/prizes.json', JSON.stringify([], null, 2));
    return res.json({ status: 'success', message: 'Los premios han sido eliminados' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`OPEN: http://localhost:${PORT}`)
});