// dock trial

const { dockStart } = require('@nlpjs/basic');
const fs = require('fs');

const desc_file = fs.readFileSync('./job_description.json');
const job_file = fs.readFileSync('./job_title.json');



(async () => {
  const dock = await dockStart({ use: ['Basic', 'ConsoleConnector']});
  const nlp = dock.get('nlp');
  await nlp.addCorpus('./corpus1.json');
  await nlp.train();
})();