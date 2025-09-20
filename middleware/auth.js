const jwt = require('jsonwebtoken');
const studentModel = require('../models/studentModel');

const auth = async function (req, res, next) {
    try {
        let authToken = req.header('Authorization')
        if (authToken) {
            authToken = authToken.replace('Bearer ', '');
            let tokenData = jwt.verify(authToken, process.env.JWT_SECRET);
            if (tokenData == null || !tokenData._id) throw new Error('Unauthorized Request!');
            let student = await studentModel.findById(tokenData._id)
            if (student == null || !student._id) throw new Error('Authentation failed, please try again.');
            req.student = student;
            next();
        } else {
            throw new Error('Authorization missing. Please authenticate first.');
        }
    } catch (tokenErr) {
        res.status(400).send(tokenErr.message)
    }
}

module.exports = auth;