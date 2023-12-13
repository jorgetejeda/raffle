const express = require('express');
const fs = require('fs-extra');

const router = express.Router();
const DIRECTORY = './database';

router.get('/prizes/view', (req, res) => {
    const prizes = fs.readFileSync('./database/prizes.json', 'utf8');

    if (!prizes) {
        return res.json({ status: 404, message: 'No hay premios disponibles', prizes: [] });
    }
    return res.json({ status: 'success', message: 'success', prizes: JSON.parse(prizes) });
})

router.get('/prizes/round', (req, res) => {
    try {
        const filePrizes = fs.readFileSync('./database/prizes.json', 'utf8');
        const prizes = JSON.parse(filePrizes);

        const nonEmptyRounds = prizes.reduce((rounds, prize) => {
            if (prize.left !== 0 || prize.left < 0 && !rounds.includes(prize.round)) {
                rounds.push(prize.round);
            }
            return rounds;
        }, []);

        if (nonEmptyRounds.length < 0) {
            throw new Error('No hay premios disponibles');
        }

        const firstNonEmptyRound = nonEmptyRounds[0];
        const roundPrizes = prizes.filter(prize => prize.round === firstNonEmptyRound);
        return res.json({ status: 200, message: 'success', prizes: roundPrizes });

    } catch (error) {
        return res.json({ status: 400, message: 'error', error: error.message });
    }
});

router.post('/prizes/create', async (req, res) => {
    const prizes = req.body;

    const prizesArr = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        amount: prizes.amount,
        quantity: parseInt(prizes.quantity),
        left: parseInt(prizes.quantity),
        round: parseInt(prizes.round),
    }

    const filePrizes = fs.readFileSync('./database/prizes.json', 'utf8');
    const prizesJSON = JSON.parse(filePrizes);
    prizesJSON.push(prizesArr);
    prizesJSON.sort((a, b) => a.round - b.round);

    fs.mkdirSync(DIRECTORY, { recursive: true });
    fs.writeFileSync('./database/prizes.json', JSON.stringify(prizesJSON, null, 2));
    return res.json({ status: 'success', message: "Los premios han sido creado con exito!" });
})

router.delete('/prizes/delete', (req, res) => {
    fs.writeFileSync('./database/prizes.json', JSON.stringify([], null, 2));
    return res.json({ status: 200, message: 'Los premios han sido eliminados' });
});

module.exports = router;