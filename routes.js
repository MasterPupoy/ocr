const router = require('express').Router();
const uri = process.env.DB_URI || 'mongodb+srv://root:lc6kHavhH6Mj8GiN@cluster0.zcrzu.mongodb.net/'
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

  // Change filename
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage:storage });

// NLP Instance
const corpus = JSON.parse(fs.readFileSync('./corpus.json'));
const NLP = new nlp();

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
  // multer middleware for uploading/storing pdf first to the server disk
  // req.file contains the file information
  if (!req.file) {
      return res.send('Please select a file to upload');
  }
  // Initialize nlp
  NLP.initialize(corpus);

  // req.file.path contains the relative path of the stored pdf
  const path = req.file.path;
  // pdf-extract options or rules for parsing data from pdf
  const options = {
    type : 'ocr',
    ocr_flags: [
      '--psm 3',
      'alphanumeric'
    ]
  }
  
  // Extract text from pdf
  const processor = pdf_extract(path, options, function(err){
    console.log('Processing...');
    if(err){
      return callback(err)
    }
  });
  
  // listens to pdf extraction completion
  processor.on('complete', async function(data) {
    // gets extracted text
    const person_data = data.text_pages;
    // loop through every page
    const extract = async() => {
      return Promise.all(person_data.map((page) => {
        // filter any new lines and empty strings
        const split = page.split('\n');
        const filterEmpty = split.filter((text) => {
          return text !== '';
        });
        // evalTessOutput() evaluates every statement using the nlp and
        // returns the array of statements and intent and collect it as another array
        return NLP.evalTessOutput(filterEmpty);
      }));
    }
    // result from the loop operation
    const result = await extract();
    // filter any null or undefined values
    const final = result.map(data => {
        return data.filter(function (el) {
          return el != null;
        });
      });
      // deletes pdf file after process is done
      fs.unlinkSync(path)
      // return the final extracted and clustered data to the client
      res.json(final);
  });
  
  // listens to pdf-extract errors
  processor.on('err', function(err) {
    inspect(err, 'error while extracting pages');
    fs.unlinkSync(path)
    res.json(err);
    return callback(err);
  })
  
})


module.exports = router;