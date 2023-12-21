const express = require('express');
const fs = require('fs-extra');

const router = express.Router();

router.get('/api/configuration', (req, res) => {
    try {
        const configuration = fs.readFileSync('./database/configuration.json', 'utf8');
        if (!configuration) {
            return res.json({ status: 404, message: 'No hay configuraciones disponibles', configuration: [] });
        }
        return res.json({ status: 200, message: 'success', configuration: JSON.parse(configuration) });
    } catch (error) {
        return res.json({ status: 400, message: 'error', error: error.message });
    }
});

router.post('/api/configuration', (req, res) => {
    try {
        const { body } = req;
        const { mainColor, secondaryColor, mainImage, headerImage } = body;
        const configuration = { mainColor, secondaryColor, mainImage, headerImage };
        fs.writeFileSync('./database/configuration.json', JSON.stringify(configuration));
        return res.json({ status: 200, message: 'success', configuration });
    } catch (error) {
        return res.json({ status: 400, message: 'error', error: error.message });
    }
});

module.exports = router;