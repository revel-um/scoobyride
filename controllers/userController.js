const User = require('../schemas/userSchema')

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.updateUser = (req, res, next) => {
    const userObj = {}

    for (const key of Object.keys(req.body)) {
        userObj[key] = req.body[key]
    }

    if (req.file !== undefined) {
        const path = process.env.BASE_URL + replaceAll(req.file.path, '\\\\', '/');
        userObj['profilePicture'] = path;
    }

    User.updateOne({ phoneNumber: req.userData.phoneNumber }, { $set: userObj }).then(result => {
        res.status(200).json({
            data: result
        })
    }).catch(err => {
        res.status(200).json({
            error: err
        })
    })
}

exports.getCurrentUser = (req, res, next) => {
    User.findOne({ phoneNumber: req.userData.phoneNumber }).exec().then(result => {
        res.status(200).json({ data: result })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.deleteUser = (req, res, next) => {
    User.deleteOne({ phoneNumber: req.userData.phoneNumber }).exec().then(result => {
        res.status(200).json({ data: result })
    }).catch(err => {
        res.status(500).json({ error: err })
    })
}

//TODO: below 2 apis are super apis and should be used only while testing and should not be
exports.getAllUsers = (req, res, next) => {
    User.find().then(result => {
        res.status(200).json({
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.deleteUserById = (req, res, next) => {
    const id = req.params.id
    User.deleteOne(id).then(result => {
        res.status(200).json({
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}