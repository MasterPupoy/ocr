const AWS = require('aws-sdk');
const fs = require('fs');

const accessKey = 'AKIAXZCDODCX2SFSTHVR';
const secretKey = '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';
const bucketName = 'streamline-ats-bucket';

const s3 = new AWS.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretKey
});

module.exports = uploadFileToAws = async (file) => {
    const filename = file.filename;
    const fileContent = fs.readFileSync(file.path);
    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: fileContent,
        ACL: 'public-read',
    }

    const aws = new Promise((resolve, reject) => s3.upload(params, (err, data) => {
        if (err) {
            console.log('error');
            console.log(err);
            // return err;
            reject(err)
        } else {
            console.log('success');
            // resolve(data.Location)
            resolve(data)
        }
    }));
    return await aws;
}