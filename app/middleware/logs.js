const logRequest = (req, res, next) => {
    console.log(`Request method: ${req.method}, URL: ${req.url}, paht: ${req.path}`);
    next();
};

module.exports = logRequest;