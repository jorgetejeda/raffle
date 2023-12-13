const express = require('express');
const fileUpload = require("express-fileupload");
const fs = require('fs-extra');

const DIRECTORY = './database';

const router = express.Router();

router.post('/particpants/upload', fileUpload({ createParentPath: true }), async (req, res) => {

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

router.delete('/participants/delete', (req, res) => {
    fs.writeFileSync('./database/participants.json', JSON.stringify([], null, 2));
    return res.json({ status: 'success', message: 'success' });
});

router.get('/participants/view', (req, res) => {
    const participants = fs.readFileSync('./database/participants.json', 'utf8');
    return res.json({ status: 'success', message: 'success', participants: JSON.parse(participants) });
});

router.put('/participants/winner/:winnerId/:prizeId', (req, res) => {

    try {
        const { winnerId, prizeId } = req.params;

        const fileParticipants = fs.readFileSync('./database/participants.json', 'utf8');
        const participants = JSON.parse(fileParticipants)

        const findWinner = participants.find(participant => participant.id === winnerId);
        const updateParticipants = participants.map(participant => {
            if (participant.id === winnerId) {
                return {
                    ...participant,
                    winner: true,
                }
            }
            return participant;
        });

        const filePrizes = fs.readFileSync('./database/prizes.json', 'utf8');
        const updatedPrizes = JSON.parse(filePrizes).map(prize => {
            if (prize.id === parseInt(prizeId)) {
                console.log(typeof prize.id, typeof parseInt(prizeId))
                return {
                    ...prize,
                    left: prize.left - 1,
                }
            }
            return prize;
        });

        const amount = updatedPrizes.find(prize => prize.id === parseInt(prizeId)).amount;

        if (amount === 0) {
            throw new Error('No hay premios disponibles');
        }

        findWinner.amount = amount;
        delete findWinner.winner;
        fs.mkdirSync(DIRECTORY, { recursive: true });

        const fileWinners = fs.readFileSync('./database/winners.json', 'utf8');
        const winnersArray = fileWinners ? JSON.parse(fileWinners) : [];
        winnersArray.push(findWinner);

        fs.writeFileSync('./database/prizes.json', JSON.stringify(updatedPrizes, null, 2));
        fs.writeFileSync('./database/participants.json', JSON.stringify(updateParticipants, null, 2));
        fs.writeFileSync('./database/winners.json', JSON.stringify(winnersArray, null, 2));

        return res.json({ status: 200, message: 'success', prizes: updatedPrizes });
    }
    catch (error) {
        return res.json({ status: 400, message: 'error', error: error.message });
    }
});

module.exports = router;