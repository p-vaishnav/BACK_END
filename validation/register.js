const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEmployeeName(data) {
    let errors = {};

    if (!Validator.isLength(data.name, {min: 4, max: 35})) {
        errors.nameErr = 'Names must be between 4 and 35';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};