const multer = require('multer')

const multerS3 = require('multer-s3');
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: "AKIAWL5HNPXS6ADVQ3NT",
    secretAccessKey: "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",
})

exports.uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: "scoobyride",
        key: function (req, file, cb) {
          cb(null, Date.now()+'.'+file.originalname.split('.')[1])
        }
    })
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.deleteImage = (link) => {
    let key = replaceAll(link, 'https://scoobyride.s3.amazonaws.com/', '');
    key = replaceAll(key, 'https://scoobyride.s3.ap-south-1.amazonaws.com/', '');
    console.log(key);
    const params = {
        Bucket: "scoobyride",
        Key: key
    };
    s3.deleteObject(params, function (err, data) {
        console.log(err);
        console.log(data); 
    });
}