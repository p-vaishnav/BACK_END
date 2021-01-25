const express = require('express');
const Employee = require('../../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const key = require('../../config/keys');
const passport = require('passport');
const validatorRegInp = require('../../validation/register');

const router = express.Router();

/** @route POST /api/employees/register
 * @desc Register User inside MongoDB
 * @access Public
 */

router.post('/register', (req, res) => {
    const  {errors, isValid} = validatorRegInp(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Employee.findOne({
        empId: req.body.empId
    }).then((emp) => {
        if (emp) {
            return res.status(200).json({
                warning: {message: ' Employee Id already exists'}
            });
        } else {
            const empImg = gravatar.url(req.body.email, {
                s: '300',
                r: 'pg',
                d: 'mm'
            });
            const employee = new Employee({
                name: req.body.name,
                password: req.body.password,
                orgName: req.body.orgName,
                empId: req.body.empId,
                mobile: req.body.mobile,
                email: req.body.email,
                empAvatar: empImg,
                psImageData: req.body.psImageData
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(employee.password, salt, (e, hash) => {
                    if (e) throw (e);
                    employee.password = hash;
                    employee.save()
                        .then(ur => {
                            res.json({
                                message: "Registration is Successful, Login Now!"
                            });
                        })
                        .catch(er => {
                            console.error(er);
                            res.json(err);
                        });
                });
            });
        }
    });
});


/** @route POST /api/employees/login
 * @desc User logged in
 * @access Public
 */

router.post('/login', (req, res) => {
    const empId = req.body.empId;
    const password = req.body.password;


    Employee.findOne({
            empId
        })
        .then(emp => {
            if (!emp) {
                return res.status(200).json({
                    warning: {message: ' Employee Id doesn\'t exist, do SignUp'}
                });
            }
            bcrypt.compare(password, emp.password).then(passed => {
                if (passed) {
                    const jwtPayload = {
                        id : emp.id,
                        name: emp.name,
                        avatar: emp.empAvatar,
                        mobile: emp.mobile,
                        email: emp.email,
                        orgName: emp.OrgName,
                        empId: emp.empId
                    };
                    jwt.sign(jwtPayload, key.secretOrKey, {expiresIn: 3600},
                        (je, jToken) => {
                            res.json({
                                usInfo: {
                                    bearerToken: jToken,
                                    name: emp.name,
                                    avatar: emp.empAvatar,
                                    mobile: emp.mobile,
                                    email: emp.email,
                                    orgName: emp.orgName,
                                    empId: emp.empId
                                },
                                message: 'Logged In Successfully'
                            });
                        }
                    );
                } else {
                    return res.status(200).json(
                        {
                            warning: {message: 'Authentication Failed - Incorrect Password'}
                        }
                    );
                }
            });
        });
});


/** @route GET /api/employees/currentEmployee
 * @desc gets the current employee
 * @access Private
 */

router.post('/identity', passport.authenticate('jwt', {session: false}), (req, res) => {
    Employee.findOne({
        empId : req.body.empId
    }).then(emp => {
        res.status(200).json({
            imgName: emp.psImageData
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({});
    });
});


module.exports = router;