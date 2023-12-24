const MB = 5; // 5MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024; // 5MB in bytes

const fileSizeLimiter = (req, res, next) => {

    if (!req.files) {
        return next();
    }

    const files = req.files;

    const filesOverLimit = []

    Object.keys(files).forEach((key) => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name);
        }
    })

    if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'son' : 'es';
        const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB}MB.`.replaceAll(',', ', ');
        const message = filesOverLimit.length < 3
            ? sentence.replace(",", "y")
            : sentence.replace(/,(?=[^,]*$)/, ' y');
        return res.status(400).json({ code: 413, status: 'error', message });
    }
    next();
}

module.exports = fileSizeLimiter;