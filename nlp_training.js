const { NlpManager } = require('node-nlp');
const fs = require('fs');
const process = require('process');

const desc_file = fs.readFileSync('./job_description.json');
const job_file = fs.readFileSync('./job_title.json');

const description = JSON.parse(desc_file);
const jobTitle = JSON.parse(job_file);

/* 
description and jobtitle array is in string 
so parsing it was need for now. 
insert dummy corpus object
*/
const corpus = {
  name : 'job description',
  locale : 'en-US',
  data : [
    {
      intent : 'job.description',
      utterances : description
    },
    {
      intent : 'job.title',
      utterances : jobTitle
    }
  ]
};

//manager.addDocument('en', 'MongoDB Atlas', 'skill');
//manager.addDocument('en', 'Renz', 'name');
//manager.addDocument('en', 'Danielle', 'name');
//manager.addDocument('en', 'Aryan', 'name');
//manager.addDocument('en', 'Delloson', 'name');
//manager.addDocument('en', 'C++', 'skill');
//manager.addDocument('en', 'Team-player', 'skill');
//manager.addDocument('en', 'Patience', 'skill');
//manager.addDocument('en', 'Javascript', 'skill');
//manager.addDocument('en', 'HTML', 'skill');

//(async() => {
//  console.log(corpus.data[0].utterances)
//  const manager = new NlpManager({ language : ['en'], forceNER: true }); 
//  await manager.addCorpus(corpus);
//  //await manager.train();
//  manager.save();
//  const response = await manager.process('en', '10 years of javascript experience');
//  const sample = await manager.process('en', 'Software Engineer');
//  const jd = await manager.process('en', 'Tensorflow and data analytics and 7 years working on Microsoft Azure');
//  const a = await manager.process('en', 'DevOps');
//  const b = await manager.process('en', 'Microsoft Azure, Amazon AWS, and Google API experience');
//  const c = await manager.process('en', 'Data analysts');
  
//  console.log(response);
//  console.log(sample.nluAnswer.classifications);
//  console.log(jd);
//  console.log(a.nluAnswer.classifications);
//  console.log(b);
//  console.log(c.nluAnswer.classifications);

//})();

/*
nlp class 
*/
class nlp {
  constructor(){
    this.manager = new NlpManager({ language : ['en'], forceNER: true })
  }
  
  /**
   * 
   * @param {object} corpus - Used for training the NER
   */
  async initialize(corpus) {

    /* 
    check for models or train here
    uncomment addCorpus and train() if will train
    and comment out load()
    */

    //await this.manager.addCorpus(corpus)
    //await this.manager.train()

    this.manager.load('./model.nlp');
  }

  async evaluate() {

    // command line interface for trying out data
    process.stdout.write('Enter any to statements to classify : \n')
    process.stdin.on('data', async (data) => {
      const response = await this.manager.process('en', data.toString().trim())
      console.log(response);
    });
  };

  /**
   * 
   * @param {string} input - string input from tesseract
   */
  async evalTessOutput(input) {
    /*
      function for processing
      tess ouput
    */

    // return nlp array of output 

  }
}

const n = new nlp();
/*
  passing in corpus in case you're training.
  It will be ignored if you're using load()
  to mount models.
*/

n.initialize(corpus);
// cli setup
n.evaluate()


