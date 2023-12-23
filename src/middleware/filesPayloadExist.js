const filePayloadExists = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ code: 400, status: 'error', message: 'No files were uploaded.' });
    }
    next();
}

module.exports = filePayloadExists;