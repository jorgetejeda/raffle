const path = require('path');

const fileExtLimiter = (allowExtArray) => {
    return (req, res, next) => {
        const files = req.files

        // check if request has files
        if (!files) { return next(); }

        const fileExtensions = []

        Object.keys(files).forEach((key) => {
            fileExtensions.push(path.extname(files[key].name))
        })

        const allowed = fileExtensions.every((ext) => allowExtArray.includes(ext))

        if (!allowed) {
            const message = `Upload failed. Only ${allowExtArray.toString()} files are allowed.`.replaceAll(',', ', ');
            return res.status(422).json({ code: 422, status: 'error', message });
        }

        next()
    }
}

module.exports = fileExtLimiter;

