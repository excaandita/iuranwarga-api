const logRequest = (req, res, next) => {
    console.log(`Request method: ${req.method}, URL: ${req.url}, path: ${req.path}`);
    next();
};

module.exports = logRequest;