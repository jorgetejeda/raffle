const express = require('express');
const fileUpload = require("express-fileupload");
const fs = require('fs-extra');

const HTTP_RESPONSE = require('../constant/http-response');

const DIRECTORY = './database';

const router = express.Router();

router.post('/particpants/upload', fileUpload({ createParentPath: true }), async (req, res) => {

    const participantCSV = req.files;

    if (!participantCSV) {
        return res.json({ ...HTTP_RESPONSE[400]('No file uploaded') });
    }

    if (!participantCSV.csvFile.name.endsWith('.csv')) {
        return res.json({ ...HTTP_RESPONSE[400]('Invalid file type. Only CSV files are allowed.') });
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

    console.log({ ...HTTP_RESPONSE[200]('Archivo se ha subido con exito') })

    return res.json({ ...HTTP_RESPONSE[200]('Archivo se ha subido con exito'), track: participantCSV })
});

router.delete('/participants/delete', (req, res) => {
    fs.writeFileSync('./database/participants.json', JSON.stringify([], null, 2));
    return res.json({ ...HTTP_RESPONSE[200]() });
});

router.get('/participants/view', (req, res) => {
    const participants = fs.readFileSync('./database/participants.json', 'utf8');
    return res.json({ ...HTTP_RESPONSE[200](), participants: JSON.parse(participants) });
});

router.put('/participants/winner/:winnerId/:awardId', (req, res) => {

    try {
        const { winnerId, awardId } = req.params;

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

        const fileawards = fs.readFileSync('./database/awards.json', 'utf8');
        const updatedAwards = JSON.parse(fileawards).map(award => {
            if (award.id === parseInt(awardId)) {
                console.log(typeof award.id, typeof parseInt(awardId))
                return {
                    ...award,
                    left: award.left - 1,
                }
            }
            return award;
        });

        const amount = updatedAwards.find(award => award.id === parseInt(awardId)).amount;

        if (amount === 0) {
            throw new Error('No hay premios disponibles');
        }

        findWinner.amount = amount;
        delete findWinner.winner;
        fs.mkdirSync(DIRECTORY, { recursive: true });

        const fileWinners = fs.readFileSync('./database/winners.json', 'utf8');
        const winnersArray = fileWinners ? JSON.parse(fileWinners) : [];
        winnersArray.push(findWinner);

        fs.writeFileSync('./database/awards.json', JSON.stringify(updatedAwards, null, 2));
        fs.writeFileSync('./database/participants.json', JSON.stringify(updateParticipants, null, 2));
        fs.writeFileSync('./database/winners.json', JSON.stringify(winnersArray, null, 2));

        return res.json({ ...HTTP_RESPONSE[200](), awards: updatedAwards });
    }
    catch (error) {
        return res.json({ ...HTTP_RESPONSE[400](error.message) });
    }
});

module.exports = router;