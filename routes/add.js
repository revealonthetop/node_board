var router = require('express').Router();

let mydb;
const mongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

mongoClient.connect(url).then(client => {
    console.log('몽고DB 접속');
    mydb = client.db('myboard');
})

router.get('/enter', function (req, res) {
    res.render('enter.ejs');
})


module.exports = router;