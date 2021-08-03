const inspect = require('eyes').inspector({ maxLength : 20000});
const pdf_extract = require('pdf-extract');
const fs = require('fs');
const nlp = require('./nlp_training');
const path = './resume.pdf';
const options = {
  type : 'ocr',
  ocr_flags: [
    '--psm 3',
    'alphanumeric'
  ]
}

const corpus = JSON.parse(fs.readFileSync('./corpus.json'));

const NLP = new nlp();

NLP.initialize(corpus);

const processor = pdf_extract(path, options, function(err){
  console.log('Processing...');
  if(err){
    return callback(err)
  }
});

processor.on('complete', async function(data) {
  // inspect(data, 'extracted text pages');
  const person_data = data.text_pages;
  // const split = person_data[0].split('\n');

  const extract = async() => {
    return Promise.all(person_data.map((page) => {
      const split = page.split('\n');
      const filterEmpty = split.filter((text) => {
        return text !== '';
      });
      return NLP.evalTessOutput(filterEmpty);
    }));
  }

  const result = await extract();
  const final = result.map(data => {
      return data.filter(function (el) {
        return el != null;
      });
    });
  // console.log(final);
  // callback(null, final);
});

processor.on('err', function(err) {
  inspect(err, 'error while extracting pages');
  return callback(err);
})