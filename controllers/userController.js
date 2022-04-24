const User = require("../schemas/userSchema");
const imageController = require("../controllers/imageController");

exports.updateUser = (req, res, next) => {
    console.log(req.userData);
    User.findById(req.userData.userId)
        .exec()
        .then((result) => {
            const userObj = req.body;
            if (req.file !== undefined) {
                if (result.profilePicture !== undefined)
                    imageController.deleteImage(result.profilePicture);
                userObj["profilePicture"] = req.file.location;
            }
            User.updateOne({ phoneNumber: req.userData.phoneNumber }, { $set: userObj })
                .then((result) => {
                    res.status(200).json({
                        data: result,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        error: err,
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.getCurrentUser = (req, res, next) => {
    User.findById(req.userData.userId)
        .exec()
        .then((result) => {
            res.status(200).json({ data: result });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.deleteUser = (req, res, next) => {
    User.findById(req.userData.userId)
        .exec()
        .then((result) => {
            imageController.deleteImage(result.profilePicture);
            User.deleteOne({ phoneNumber: req.userData.phoneNumber })
                .exec()
                .then((result) => {
                    res.status(200).json({ data: result });
                })
                .catch((err) => {
                    res.status(500).json({ error: err });
                });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
};

//TODO: below 2 apis are super apis and should be used only while testing and should not be
exports.getAllUsers = (req, res, next) => {
    User.find()
        .then((result) => {
            res.status(200).json({
                data: result,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.deleteUserById = (req, res, next) => {
    const id = req.params.id;
    User.findOne(id)
        .exec()
        .then((result) => {
            imageController.deleteImage(result.profilePicture);
            User.deleteOne(id)
                .then((result) => {
                    res.status(200).json({
                        data: result,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        error: err,
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
};

exports.removeProfilePicture = (req, res, next) => {
    User.findById(req.userData.userId)
        .exec()
        .then((result) => {
            console.log("profile picture = " + result.profilePicture);
            if (result.profilePicture !== undefined) {
                imageController.deleteImage(result.profilePicture);
                result.profilePicture = undefined;
                result.save();
                return res.send({ message: "Image deleted" });
            }
            res.send({ message: "No picture was attached to user" });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
