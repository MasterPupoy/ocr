const router = require('express').Router();
const uri = process.env.DB_URI || 'mongodb uri'
const { MongoClient } = require('mongodb');

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
router.get('/:applicant_id', (req, res) => {
  
  console.log(req.params);

  client.connect().then(() => {
    console.log('connected to mongodb')

    res.send(testCollection.find({}))
    client.close()
  }).catch(err => console.log(err))


})

// post parsed data to db
router.post('/:applicant_id', (req, res) => {
  
  client.connect().then(() => {
    console.log('connected to mongodb')

    res.send(testCollection.find({}))
    client.close()
  }).catch(err => console.log(err))

})

module.exports = router;