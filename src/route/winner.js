const express = require('express');
const fs = require('fs-extra');
const HTTP_RESPONSE = require('../constant/http-response');

const router = express.Router();

router.get('/winners/view', (req, res) => {
    const winners = fs.readFileSync('./database/winners.json', 'utf8');
    return res.json({ ...HTTP_RESPONSE[200](), winners: JSON.parse(winners) });
});

router.delete('/winners/delete', (req, res) => {
    fs.writeFileSync('./database/winners.json', JSON.stringify([], null, 2));
    return res.json({ ...HTTP_RESPONSE[200]() });
});

module.exports = router;