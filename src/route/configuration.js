const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const filesPayloadExists = require('../middleware/filesPayloadExists');

const router = express.Router();

router.get('/api/configuration', (req, res) => {
    try {
        const configuration = fs.readFileSync('./database/configuration.json', 'utf8');
        if (Object.keys(configuration).length === 0 && configuration.constructor === Object) {
            return res.json({ status: 404, message: 'No hay configuraciones disponibles', configuration: {} });
        }
        return res.json({ status: 200, message: 'success', configuration: JSON.parse(configuration) });
    } catch (error) {
        return res.json({ status: 400, message: 'error', error: error.message });
    }
});

router.post(
    '/api/configuration',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.jpg', '.png', '.jpeg']),
    fileSizeLimiter, 
    (req, res) => {
        const IMAGES_RAFFLE = './public/images/raffle';
        try {

            const {mainColor, secondaryColor} = req.body;
            const {mainImage, headerImage} = req.files;

            const configuration = {
                mainColor: mainColor || '#bdc3c7',
                secondaryColor: secondaryColor || '#34495e',
                mainImage: mainImage?.name || null,
                headerImage: headerImage?.name || null,
            };
            fs.writeFileSync('./database/configuration.json', JSON.stringify(configuration));

            // before move images to images directory, check if directory exists
            if (!fs.existsSync(IMAGES_RAFFLE)) {
                console.log('no existe')
                fs.mkdirSync(IMAGES_RAFFLE);
            }

            // clear directory before move images
            // fs.emptyDirSync(IMAGES_RAFFLE);

            // move images to images directory
            mainImage.mv(`${IMAGES_RAFFLE}/${mainImage.name}`);
            headerImage.mv(`${IMAGES_RAFFLE}/${headerImage.name}`);

            return res.json({ status: 200, message: 'success', configuration });
        } catch (error) {
            return res.json({ status: 400, message: 'error', error: error.message });
        }
    });

module.exports = router;