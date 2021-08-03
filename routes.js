const router = require('express').Router();
const uri = process.env.DB_URI || 'mongo uri'
const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path');
const pdf_extract = require('pdf-extract');
const nlp = require('./nlp_training');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage:storage })


const client = new MongoClient(uri, {
  useNewUrlParser : true
});

const testCollection = client.db('local').collection('test');



/*
  Pass authentication as middleware. 
  ex. router.get('/', auth.verify, (req, res) => {
    do something
  })
*/

// get applicant parsed resume data from db
router.get('/applicant/:applicant_id', (req, res) => {
  
  console.log(req.params);

  client.connect().then(() => {
    console.log('connected to mongodb')

    res.send(testCollection.find({}))
    client.close()
  }).catch(err => console.log(err))


})

// post parsed data to db
router.post('/applicant/:applicant_id', (req, res) => {
  
  client.connect().then(() => {
    console.log('connected to mongodb')

    res.send(testCollection.find({}))
    client.close()
  }).catch(err => console.log(err))

})


router.post('/extract-pdf', upload.single('resume'), (req, res) => {  
  if (!req.file) {
      return res.send('Please select a file to upload');
  }
  
  const path = req.file.path;
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
      fs.unlinkSync(path)
      res.json(final);
    // console.log(final);
    // callback(null, final);
  });
  
  processor.on('err', function(err) {
    inspect(err, 'error while extracting pages');
    fs.unlinkSync(path)
      res.json(final);
    return callback(err);
  })
  
})


module.exports = router;