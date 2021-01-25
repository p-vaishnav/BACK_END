const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Registered User Schema
 */

const RegisteredEmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orgName: {
        type: String,
        required: true
    },
    empId: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    psImageData: {
        type: String,
        required: true
    },
    empAvatar: {
        type: String,
        required: true
    }
});

module.exports = Employee = mongoose.model('employees', RegisteredEmployeeSchema);
