const express = require('express');
const app = express();
const port = 8081;

app.set('view engine', 'ejs');

//컴퓨터 포트 열기는 port 

// 바디 파서를 이용 해야 만 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// mysql 연결문
// let mysql = require('mysql');
// let conn = mysql.createConnection({
//     host: "localhost",
//     user : "root",
//     password: "123456",
//     database: "myboard", // 스키마 이름을 의미하는 것.
// });

let mydb;
const MongoClient = require('mongodb').MongoClient;
const url='mongodb+srv://admin:1234@cluster0.ghyatym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

MongoClient.connect(url).then((client)=>{
    console.log('몽고DB 접속 성공');

    mydb = client.db('myboard'); // 몽고DB에 있는 컬렉션에 접근하는 코드 여기서는 'post'로 접근하고 있다.
    //post 로 접근해서 데이터를 read 하는 코드
    mydb.collection('post').find().toArray().then((result)=>{
        console.log(result)
    })
    app.listen(port, () => {
        console.log(`서버 동작중 at http://localhost:${port} 으로 서버 대기중/`);
    });
});

// 서버를 먼저 열고 그 다음에 DB를 연결 하는 순서가 권장된다.

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/book', function (req, res) {
    res.send('도서 목록 관련 페이지 입니다.')
})

app.get('/list', function(req, res) {
    mydb.collection('post').find().toArray(function(err,result){
        console.log(result);
    })
    //res.sendFile(__dirname + '/list.html');
    res.render('list.ejs',{data:result});
});


app.get('/enter', function(req,res){
    // res.sendFile(__dirname + '/enter.html');
    res.render('enter.ejs')
});

// 

app.post('/save', function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate)


    // my sql에 서버를 연결하는 방법
    // let sql = "insert into post (title,content, created) \  values (?,?,now())";
    // let params = [req.body.title, req.body.content];
    // conn.query(sql, params, function (err, rows) {
    //     if (err) throw err;
    //     console.log(rows);
    // });

    // 몽고 DB에 데이터 저장

    mydb.collection('post').insertOne(
        {
        title : req.body.title, 
        content : req.body.content,
        date: req.body.someDate
    }
    ).then((result)=>
        {
        console.log(result);
        console.log('데이터 저장 완료');
    }
);

    res.send('데이터 저장완료');
})

app.post('/delete', function(req,res){
    console.log(req.body);
    mydb.collection('post').deleteOne(req.body)
    .then((result)=>{
        console.log('삭제완료');
    })

})

// 몽고DB가 좋은 이유만약 서버를 계속해서 사용하고 싶다면 컴퓨터 한대를 계속해서 켜 놔야 한다.

// 하지만 작업을 할 때 컴퓨터 한대가 계속 열려 있다면 문제가 발생할 가능성이 있다.

// 몽고 DB는 상시 24시간 열려 있으므로 팀 프로젝트를 진행 할때 제한 사항이 적다. 

// 그래서 몽고db를 추천 한다.