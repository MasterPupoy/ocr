const { NlpManager } = require('node-nlp');
const fs = require('fs');
const process = require('process');

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
module.exports = class nlp {
  constructor(){
    this.manager = new NlpManager({ language : ['en'], forceNER: true })
  }
  
  /**
   * 
   * @param {object} corpus - Used for training the NER
   */
  async initialize(corpus, isTrain = false) {

    /* 
    check for models or train here
    uncomment addCorpus and train() if will train
    and comment out load()
    */

    //await this.manager.addCorpus(corpus)
    //await this.manager.train()

    if(fs.existsSync('./model.nlp') && !isTrain){
      console.log('no train needed');
      this.manager.load('./model.nlp');
    }else{
      if (corpus) {
        console.log('training needed! Training...');
        this.manager.addCorpus(corpus);
        // this.manager.addCorpus('./skills.json');
        this.manager.train();
        this.manager.save();
        console.log('Train Done!');
      }
    }
  }

  async evaluate() {

    // command line interface for trying out data
    // process.stdout.write('Enter any to statements to classify : \n')
    process.stdin.on('data', async (data) => {
      const response = await this.manager.process('en', data.toString().trim());
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
      return await Promise.all(input.map(async(data) => {
        const evaluate = await this.manager.process('en', data.toString().trim());
        if (evaluate.intent !== 'None') {
          return {
            statement: data.toString().trim(),
            intent: evaluate.intent
          }
        }
      }));

    // return nlp array of output 

  }
}

// const n = new nlp();
/*
  passing in corpus in case you're training.
  It will be ignored if you're using load()
  to mount models.
*/

// n.initialize(corpus);
// cli setup
// n.evaluate();