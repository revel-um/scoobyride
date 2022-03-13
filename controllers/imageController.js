const multer = require('multer')

const multerS3 = require('multer-s3');
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: "AKIAVVOH26TC752KYE7S",
    secretAccessKey: "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",
})

exports.uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: "verent",
        key: function (req, file, cb) {
          cb(null, Date.now()+'.'+file.originalname.split('.')[1])
        }
    })
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.deleteImage = (link) => {
    let key = replaceAll(link, 'https://verent.s3.amazonaws.com/', '');
    key = replaceAll(key, 'https://verent.s3.ap-south-1.amazonaws.com/', '');
    console.log(key);
    const params = {
        Bucket: "verent",
        Key: key
    };
    s3.deleteObject(params, function (err, data) {
        console.log(err);
        console.log(data); 
    });
}