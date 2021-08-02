const inspect = require('eyes').inspector({ maxLength : 20000});
const pdf_extract = require('pdf-extract');
const fs = require('fs');
const path = './files/resume.pdf';
const options = {
  type : 'ocr'
}


const processor = pdf_extract(path, options, function(err){
  if(err){
    return callback(err)
  }
});

processor.on('complete', function(data) {
  inspect(data, 'extracted text pages');
  const person_data = data.text_pages
  const split = person_data[0].split('\n');

  inspect(split, 'split texts')
  fs.writeFileSync('./extracted.json', JSON.stringify(person_data));
});

processor.on('err', function(err) {
  inspect(err, 'error while extracting pages');
  return callback(err);
})