const express = require('express');

/**
 * 
 * @param {object} dependencies
 */
function createRouter(dependencies) {
    const {} = dependencies;

    let router = express.Router();

    router.post('/login', (req, res, next) => {
        next(new Error('Not implemented'));
    });
    return router;
}

module.exports = {
    createRouter
};