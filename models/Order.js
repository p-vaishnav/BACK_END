const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Registered User Schema
 */

const OrderSchema = new Schema({
    orderedItems: {
        type: Array,
        required: true
    },
    mobNo: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    empId: {
        type: String,
        required: true
    },
    orderingTime: {
        type: String,
        required: true
    },
    servingTime: {
        type: String,
        required: true
    },
    completedOrders: {
        type: Object,
        required: true
    }
});

module.exports = Employee = mongoose.model('orders', OrderSchema);
