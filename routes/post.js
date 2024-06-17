var router = require('express').Router();

//MongoDB 연동
let mydb;
const mongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

mongoClient.connect(url).then(client => {
    console.log('몽고DB 접속');
    mydb = client.db('myboard');

    app.listen(process.env.PORT, function () {
        console.log(`서버 동작중 at http://localhost:${port} 으로 서버 대기중/`);
    });
})


router.get('/list', function (req, res) {
    mydb.collection('post').find().toArray().then((result) => {
        // console.log(result);

        res.render('list.ejs', { data: result });
    })
})

module.exports = router;
