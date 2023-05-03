const S3 = require('aws-sdk/clients/s3');
const fs = require('fs')

const S3_BUCKET ='nurture-nest'; 
const REGION ='us-west-2';
const ACCESS_KEY ='AKIA3CHU3JX35DIMX4BV';
const SECRET_ACCESS_KEY ='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';

const s3 =  new S3({
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
})

//upload a file to s3
function uploadFile(file){
    console.log(file, "ye rahi file")
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.fileName
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile


//download