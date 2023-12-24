const express = require('express');
const fs = require('fs-extra');
const HTTP_RESPONSE = require('../constant/http-response');

const router = express.Router();
const DIRECTORY = './database';

router.get('/awards/view', (req, res) => {
    try {
        const awards = fs.readFileSync('./database/awards.json', 'utf8');
        if (!awards) {
            return res.json({ ...HTTP_RESPONSE[400]('No hay premios disponibles'), awards: [] });
        }
        return res.json({ ...HTTP_RESPONSE[200](), awards: JSON.parse(awards) });
    } catch (error) {
        return res.json({ ...HTTP_RESPONSE[400](error.message) });
    }
})

router.get('/awards/round', (req, res) => {
    try {
        const fileawards = fs.readFileSync('./database/awards.json', 'utf8');
        const awards = JSON.parse(fileawards);

        const nonEmptyRounds = awards.reduce((rounds, prize) => {
            if (prize.left !== 0 || prize.left < 0 && !rounds.includes(prize.round)) {
                rounds.push(prize.round);
            }
            return rounds;
        }, []);

        if (nonEmptyRounds.length < 0) {
            throw new Error('No hay premios disponibles');
        }

        const firstNonEmptyRound = nonEmptyRounds[0];
        const roundawards = awards.filter(prize => prize.round === firstNonEmptyRound);
        return res.json({ ...HTTP_RESPONSE[200](), awards: roundawards });

    } catch (error) {
        return res.json({ ...HTTP_RESPONSE[400](error.message) });
    }
});

router.post('/awards/create', async (req, res) => {
    const awards = req.body;
    try {
        const awardsArr = {
            id: new Date().getTime() + Math.floor(Math.random() * 1000),
            amount: awards.amount,
            quantity: parseInt(awards.quantity),
            left: parseInt(awards.quantity),
            round: parseInt(awards.round),
        }

        const fileawards = fs.readFileSync('./database/awards.json', 'utf8');
        const awardsJSON = JSON.parse(fileawards);
        awardsJSON.push(awardsArr);
        awardsJSON.sort((a, b) => a.round - b.round);

        fs.mkdirSync(DIRECTORY, { recursive: true });
        fs.writeFileSync('./database/awards.json', JSON.stringify(awardsJSON, null, 2));
        return res.json({ ...HTTP_RESPONSE[200]("Los premios han sido creado con exito!") });
    } catch (error) {
        return res.json({ ...HTTP_RESPONSE[400](error.message) });
    }
})

router.delete('/awards/delete', (req, res) => {
    try {
        fs.writeFileSync('./database/awards.json', JSON.stringify([], null, 2));
        return res.json({ ...HTTP_RESPONSE[200]('Los premios han sido eliminados') });
    } catch (error) {
        return res.json({ ...HTTP_RESPONSE[400](error.message) });
    }
});

module.exports = router;