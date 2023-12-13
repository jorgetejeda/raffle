const express = require('express');
const fs = require('fs-extra');

const router = express.Router();

router.get('/winners/view', (req, res) => {
    const winners = fs.readFileSync('./database/winners.json', 'utf8');
    return res.json({ status: 'success', message: 'success', winners: JSON.parse(winners) });
});

router.delete('/winners/delete', (req, res) => {
    fs.writeFileSync('./database/winners.json', JSON.stringify([], null, 2));
    return res.json({ status: 'success', message: 'success' });
});

module.exports = router;