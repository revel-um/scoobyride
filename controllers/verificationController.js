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
        let b = true;
        User.findOne({ phoneNumber: phoneNumber }).exec().then(result => {
            let userId;
            if (result == null) {
                b = true;
                userId = mongoose.Types.ObjectId();
            }
            else {
                b = false;
                userId = result._id;

            }
            const token = jwt.sign({
                phoneNumber: phoneNumber,
                code: otp,
                userId: userId
            }, "SCOOBY_JWT_PASSKEY", {
                expiresIn: "30d"
            })
            if (b == true) {
                const user = new User({
                    _id: userId,
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
            } else {
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