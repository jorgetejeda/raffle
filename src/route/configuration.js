const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const HTTP_RESPONSE = require('../constant/http-response');

const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');

const router = express.Router();

router.get('/api/configuration', (req, res) => {
    try {
        const configuration = fs.readFileSync('./database/configuration.json', 'utf8');
        if (Object.keys(configuration).length === 0 && configuration.constructor === Object) {
            return res.json({ ...HTTP_RESPONSE[404](), configuration: {} });
        }
        return res.json({ ...HTTP_RESPONSE[200](), configuration: JSON.parse(configuration) });
    } catch (error) {
        return res.json({ ...HTTP_RESPONSE[400](error.message) });
    }
});

router.post(
    '/api/configuration',
    fileUpload({ createParentPath: true }),
    fileExtLimiter(['.jpg', '.png', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const IMAGES_RAFFLE = './public/images/raffle';
        try {

            const { mainColor, secondaryColor, title } = req.body;

            let files = {
                mainImage: null,
                headerImage: null,
            }

            if (req.files) {
                files = req.files;
            }

            if (!fs.existsSync(IMAGES_RAFFLE)) {
                fs.mkdirSync(IMAGES_RAFFLE);
            }

            // clear directory before move images
            // fs.emptyDirSync(IMAGES_RAFFLE);

            const configurationFile = fs.readFileSync('./database/configuration.json', 'utf8');
            let configuration = JSON.parse(configurationFile);

            configuration = {
                mainColor: mainColor || '#bdc3c7',
                secondaryColor: secondaryColor || '#34495e',
                title: title || 'Rifa',
                mainImage: files.mainImage ? files.mainImage.name : configuration.mainImage,
                headerImage: files.headerImage ? files.headerImage.name : configuration.headerImage,
            };

            if (files.mainImage) {
                files.mainImage.mv(`${IMAGES_RAFFLE}/${files.mainImage.name}`);
            }
            if (files.headerImage) {
                files.headerImage.mv(`${IMAGES_RAFFLE}/${files.headerImage.name}`);
            }

            fs.writeFileSync('./database/configuration.json', JSON.stringify(configuration));

            return res.json({ ...HTTP_RESPONSE[200]() });
        } catch (error) {
            return res.json({ ...HTTP_RESPONSE[400](error.message) });
        }
    });

module.exports = router;