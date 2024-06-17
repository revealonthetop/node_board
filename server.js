//MySQL + Node.js 접속
// let mysql = require('mysql');
// let conn = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : '123456',
//     database : 'myboard',
// });
// 
// conn.connect();

const express = require('express');
const app = express();
const port = 8081;

const dotenv = require('dotenv').config();




// multer 라이브러리 추가
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, done) {
        done(null, './public/images');
    },
    filename: function (req, file, done) {
        done(null, file.originalname);
    }
})

let uploader = multer({ storage: storage });

//body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// cookie-parser 라이브러리 추가
const cookieParser = require('cookie-parser');
app.use(cookieParser());



// ejs 라이브러리 추가
app.set('view engine', 'ejs');

// 정적 파일 라이브러리 추가

app.use("/public",express.static('public'));

const DB_URL = 'mongodb+srv://admin:1234@cluster0.ghyatym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//MongoDB 연동
let mydb;
const mongoClient = require('mongodb').MongoClient;
const url = DB_URL;


mongoClient.connect(url).then(client => {
    console.log('몽고DB 접속');
    mydb = client.db('myboard');

    app.listen(port, function () {
        console.log(`서버 동작중 at http://localhost:${port} 으로 서버 대기중/`);
    });
})

app.use('/', require('./routes/post'));

// app.listen(8081, function(){
//     console.log("포트 8081으로 서버 대기...");
// });

const ObjId = require('mongodb').ObjectId;

// app.get('/book', function (req, res) {
//     res.send('도서 목록 관련 페이지입니다.');
// })

app.get('/', function (req, res) {
    if(req.session.user){
        res.render("index.ejs", {user:req.session.user});
    }else{
        res.render('index.ejs', {user:null});
    }
})



app.post('/delete', function (req, res) {
    console.log(req.body._id);
    req.body._id = new objId(req.body._id);
    mydb.collection('post').deleteOne(req.body)
        .then((result) => {
            res.status(200).send();
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        })
})

app.get('/content/:id', function(req, res){  
    console.log(req.params.id);  
    req.params.id = new ObjId(req.params.id);
    mydb
    .collection('post')
    .findOne({_id : req.params.id})
    .then(result=>{
        console.log(result);
        res.render('content.ejs', {data : result});
    })   
})


// app.get('/edit/:id', function (req, res) {
//     console.log(req.params.id);

//     req.params.id = new ObjId(req.params.id);
//     mydb
//         .collection('post')
//         .findOne({ _id: req.params.id })
//         .then(result => {
//             console.log(result);
//             res.render('edit.ejs', { data: result });
//         })
//     res.render('edit.ejs');
// })
app.get('/edit/:id', function(req, res){
    //주의할점 1. mongoDB의 id 주소를 알고 있어서, 원랙 글을 호출해야 한다.
    //주의할점 2. 그 id로 가져온 데이터를 제목/내용/작성일에 표시해야 한다.
    req.params.id = new ObjId(req.params.id)
    mydb
        .collection('post')
        .findOne({_id : req.params.id })
        .then(result=>{
            console.log(result);
            res.render('edit.ejs', {data : result});  
    }) 
})


app.post('/edit', function (req, res) {
    //몽고DB에 데이터 저장
    console.log(req.body)
    req.body.id = new ObjId(req.body.id);

    console.log("타입캐스팅 끝")
    console.log(req.body)

    mydb.collection('post').updateOne(
        { _id: req.body.id},
        { $set: { 
                title: req.body.title, 
                content: req.body.content ,
                date: req.body.someDate
            } }
    ).then((result) => {
        console.log(result);
        res.redirect('/list');
    })
    .catch((err)=>{
        console.log(err);
    })
    ;
})

// 쿠키 예제
app.get('/cookie', function (req, res) {
    let milk = parseInt(req.cookies.milk) + 1000;
    if(isNaN(milk))
        {
            milk = 1000;
        }
    res.cookie('milk',milk); //cookie(키,값)
    // res.send('product : ' + milk+'원'); 
})


app.get('/session', function (req, res) {
    if(isNaN(req.session.milk))
        {
            req.session.milk = 1000;
        }
    req.session.milk += 1000;
    res.send('product : ' + req.session.milk+'원'); 
})


// 만약에 찾게 되면 몽고 DB 내에서 찾은 값의 객체가 result로 전부 넘어오게 된다.


app.get('/logout', function(req, res){
    console.log('로그아웃');
    req.session.destroy()
    res.render("index.ejs",{user:null});
})

// 회원가입 페이지 처리

app.get('/signup', function(req, res){
    console.log('회원가입페이지 접속')
    res.render('signup.ejs');
})

app.post('/signup', function(req, res){
    console.log(req.body);
    console.log(sha(req.body.userpw))

    //몽고DB에 데이터 저장하기
    mydb.collection('account').insertOne(
        {
            userid: req.body.userid,
            userpw: sha(req.body.userpw),
            usergroup: req.body.usergroup,
            userEmail: req.body.userEmail
        })
        .then((result) => {
            console.log(result);
            console.log('회원가입 성공');
            res.redirect('/login');
        })
})

// 

let upload = multer({storage: storage})

let imagepath = '';

app.post('/photo', upload.single('picture'),function(req, res){
    console.log(req.file.path);
    console.log(req.file);
    imagepath = '\\' + req.file.path;
})

app.post('/save', function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);

    //몽고DB에 데이터 저장
    mydb.collection('post').insertOne(
        { 
        title: req.body.title, 
        content: req.body.content, 
        date: req.body.someDate,
        path : imagepath
        }
    ).then((result) => {
        console.log(result);
        console.log('데이터 저장완료');
    });


    // let sql = "insert into post (title, content, created) \
    //     values (?, ?, now())";
    // let params = [req.body.title, req.body.content];
    // conn.query(sql, params, function(err, result){
    //     if(err) throw err;
    //     console.log('데이터 저장완료');    
    // })
    res.redirect('/list');
})

app.get('/search', function(req, res){
    console.log(req.query.value);
    mydb.collection('post')
    .find({title : req.query.value}).toArray()
    .then((result) => {
        console.log(result);
    })
})
