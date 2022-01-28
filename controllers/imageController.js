const multer = require('multer')

const multerS3 = require('multer-s3');
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
})

exports.uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
          cb(null, Date.now()+file.originalname)
        }
    })
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.deleteImage = (link) => {
    const key = replaceAll(link, 'https://verent.s3.amazonaws.com/', '');
    console.log(key);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };
    s3.deleteObject(params, function (err, data) {
    });
}