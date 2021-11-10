const config = require('../config')
const twilio = require('twilio')
const jwt = require('jsonwebtoken')
const client = twilio(config.accountSID, config.authToken)
const User = require('../schemas/userSchema')
const mongoose = require('mongoose')

exports.sendOtp = (req, res, next) => {
    const phoneNumber = '+' + req.query.phoneNumber;

    client.verify.services(config.serviceID).verifications.create({
        to: phoneNumber,
        channel: 'sms'
    }).then(result => {
        res.status(200).json({
            message: "Otp sent successfully",
            response: result
        })
    }).catch(err => {
        res.status(500).json({ error: err })
    })
}

exports.verifyOtp = (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;

    client.verify.services(config.serviceID).verificationChecks.create({
        to: phoneNumber,
        code: otp
    }).then(result => {

        console.log('JWT_KEY = ' + process.env.SECRET_JWT_KEY);
        const token = jwt.sign({
            phoneNumber: phoneNumber,
            code: otp
        }, process.env.SECRET_JWT_KEY, {
            expiresIn: "30d"
        })

        User.findOne({ phoneNumber: phoneNumber }).exec().then(result => {
            if (result == null) {
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    phoneNumber: phoneNumber
                })

                user.save().then(result => {
                    return res.status(200).json({
                        token: token,
                        response: result
                    })
                }).catch(err => {
                    return res.status(400).json({ saveError: err })
                })
            }
            else {
                return res.status(200).json({
                    token: token,
                    response: result
                })
            }
        })
    }).catch(err => {
        console.log('inside catch verify');
        res.status(500).json({ verifyError: err })
    })
}