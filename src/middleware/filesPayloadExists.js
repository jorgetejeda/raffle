const filesPayloadExists = (req, res, next) => {
    console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ code: 400, status: 'error', message: 'No files were uploaded.' });
    }
    next();
}

module.exports = filesPayloadExists;