var jwt = require('jsonwebtoken');
var config = require('../config/index');

var authMiddleware = function (req, res, next) {
    const token = req.body.access_token || req.query.access_token || req.headers.access_token;
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.status(403).send({success: false,token:'invalid', message: 'Failed to authenticate access token.'});
            } else {
                const userId = req.params.user_id || req.body.user_id || req.query.user_id;
                if (userId && decoded.id !== userId) {
                    res.status(403).send({success: false,token:'invalid', message: 'Failed to authenticate access token.'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            }
        });
    } else {
        res.status(403).send({success: false, token:'invalid',error: 'No access token provided.'});
    }
}
module.exports = authMiddleware;