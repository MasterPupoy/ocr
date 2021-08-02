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
const desc_file = fs.readFileSync('./job_description.json');
const job_file = fs.readFileSync('./job_title.json');

const description = JSON.parse(desc_file);
const jobTitle = JSON.parse(job_file);

/* 
description and jobtitle array is in string 
so parsing it was need for now. 
insert dummy corpus object
*/
const filteredDescription = description.filter(function (el) {
  return el != null;
});

const filteredJobTitle = jobTitle.filter(function (el) {
  return el != null;
});
const corpus = {
  name : 'job description',
  locale : 'en-US',
  data : [
    {
      intent : 'job.description',
      utterances : filteredDescription
    },
    {
      intent : 'job.title',
      utterances : filteredJobTitle
    }
  ]
};


const NLP = new nlp();

NLP.initialize(corpus);

const processor = pdf_extract(path, options, function(err){
  console.log('Processing...');
  if(err){
    return callback(err)
  }
});

processor.on('complete', function(data) {
  // inspect(data, 'extracted text pages');
  const person_data = data.text_pages;
  // const split = person_data[0].split('\n');

  const extract = async() => {
    return Promise.all(person_data.map((page) => {
    const split = page.split('\n');
    const filterEmpty = split.filter((text) => {
      return text !== '';
    });
    return NLP.evaluate(filterEmpty);
  }));
}
  
//extracted data here
  extract().then(data => {
    // console.log(data[0]);
    // let filteredData = [];
    const filtered = data.map(result => {
      return result.filter(function (el) {
        return el != null;
      });
    });

    // final extracted array
    console.log(filtered);
  });
  // console.log(filteredSplit);
});

processor.on('err', function(err) {
  inspect(err, 'error while extracting pages');
  return callback(err);
})