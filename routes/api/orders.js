const express = require('express');
const Order = require('../../models/Order');
const passport = require('passport');
const router = express.Router();


/** @route POST /api/employees/orders
 * @desc posts the current employee order
 * @access Private
 */


router.post('/place', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const order = new Order({
        orderedItems: req.body.orderedItems,
        mobNo: req.body.mobNo,
        empId: req.body.empId,
        name: req.body.name,
        orderingTime: req.body.orderingTime,
        servingTime: req.body.servingTime,
        completedOrders: req.body.completeOrder
    });

    order.save().then((result) => {
        res.status(200).json({
            message: "Order placed successfully"
        });
    }).catch((err) => {
        console.error(err);
        res.status(400).send({});
    });
});


/** @route POST /api/employees/orders
 * @desc posts the current employee order
 * @access Private
 */


router.post('/list', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
  if (!req.body.empId) {
        return res.status(400).json({
            'message': 'Employee Id is not given in the form'
        });
    }
    Order.find({}).then((orders) => {
        let employeeOrder = [];
        orders.forEach((order) => {
            if (order.empId === req.body.empId) {
                employeeOrder.push(order.completedOrders);
            }
        });
        res.status(200).json({
            allOrders: employeeOrder
        });
    }).catch((err) => {
        console.error(err);
        res.status(200).json({
            allOrders: []
        });
    });

});

module.exports = router;