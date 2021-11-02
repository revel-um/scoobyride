const User = require('../schemas/userSchema')
const { Storage } = require('@google-cloud/storage')
const path = require('path')

const storage = new Storage({
    keyFilename: path.join(__dirname, '../madhuram-328908-1738d4396037.json'),
    projectId: "madhuram-328908",
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function deleteObject(url) {
    if (url == null) return;
    new Promise((resolve, reject) => {
        const imageurl = replaceAll(url, 'https://storage.googleapis.com/madhuram-storage/', '');
        storage
            .bucket("madhuram-storage")
            .file(imageurl)
            .delete()
            .then((image) => {
                resolve(image)
            })
            .catch((e) => {
                reject(e)
            });
    });
}

exports.updateUser = (req, res, next) => {
    User.findOne({ phoneNumber: req.userData.phoneNumber }).exec().then(result => {
        deleteObject(result.profilePicture)
        const userObj = {}
        for (const key of Object.keys(req.body)) {
            userObj[key] = req.body[key]
        }
        if (req.file !== undefined) {
            const path = replaceAll(req.file.path, '//', '/');
            path = replaceAll(req.file.path, 'madhuram-storage.storage.googleapis.com', '/storage.googleapis.com/madhuram-storage')
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
    }).catch(err => {
        res.status(500).json({
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
    User.findOne({ phoneNumber: req.userData.phoneNumber }).exec().then(result => {
        deleteObject(result.profilePicture);
        User.deleteOne({ phoneNumber: req.userData.phoneNumber }).exec().then(result => {
            res.status(200).json({ data: result })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
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