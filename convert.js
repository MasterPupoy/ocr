const readline = require('readline');
const Papa = require('papaparse');
const fs = require('fs');

let fileInputName = fs.readFileSync('./csv/DataEngineer.csv', 'utf-8'); 

let corpus = {
  name : 'job',
  locale : 'en-US',
  data : [
    {
      intent : 'job.description',
      utterances : []
    },
    {
      intent : 'job.title',
      utterances : []
    }
  ]
}

Papa.parse(fileInputName, {
  complete: function(result) { 

    result.data.forEach(async data => {
      let description = await data.JobDescription.trim()

      corpus.data[1].utterances.push(description)
    })

  },

  header: true
});

Papa.parse(fileInputName, {
  complete: function(result) { 

    result.data.forEach(async data => {
      let title = await data.JobTitle.trim()

      corpus.data[1].utterances.push(title)
    })

  },
  header: true
});



//function convert(file) {

//    return new Promise((resolve, reject) => {

//        const stream = fs.createReadStream(file);
//        // Handle stream error (IE: file not found)
//        stream.on('error', reject);

//        const reader = readline.createInterface({
//            input: stream
//        });

//        const array = [];

//        reader.on('line', line => {
//            array.push(JSON.parse(line));
//        });

//        reader.on('close', () => resolve(array));
//    });
//}


//convert('./corpus.json')
//    .then(res => {
//        console.log(res);
//    })
//    .catch(err => console.error(err));

