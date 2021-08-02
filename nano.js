const request = require('request')


//var request = require('request')
//const options = {
//    url : 'https://app.nanonets.com/api/v2/OCR/Model/' + '1854f1fc-9e50-4edf-aa0e-42b4c9dbf7b3',
//    headers: {
//        'Authorization' : 'Basic ' + Buffer.from('IbEkUIEpT0dkniapI6RmSE_GjIfBmeFS' + ':').toString('base64')
//    }
//}
//request.get(options, function(err, httpResponse, body) {

//  console.log(body)
//});

const fs = require('fs')
const form_data = {'modelId' : '1854f1fc-9e50-4edf-aa0e-42b4c9dbf7b3', 'file' : fs.createReadStream('resume.pdf')}
const options = {
    url : 'https://app.nanonets.com/api/v2/OCR/Model/1854f1fc-9e50-4edf-aa0e-42b4c9dbf7b3/LabelFile/',
    formData: form_data,
    headers: {
        'Authorization' : 'Basic ' + Buffer.from('IbEkUIEpT0dkniapI6RmSE_GjIfBmeFS' + ':').toString('base64')
    }
}
request.post(options, function(err, httpResponse, body) {

  const data = JSON.parse(body)
  console.log(data.result[0])
});